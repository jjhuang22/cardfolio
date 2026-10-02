import assert from "node:assert/strict";
import test from "node:test";
import { creditIsDue, creditState, creditSummary, formatCreditAmount } from "../app/lib/core/credits.ts";
import { exportTables } from "../app/lib/core/export.ts";
import { indexPortfolio, type Credit, type PortfolioData } from "../app/lib/core/model.ts";
import { dailyReminder } from "../app/lib/core/reminders.ts";
import { dueItems } from "../app/lib/core/stats.ts";
import { dueText } from "../app/lib/presentation/due.ts";

const credit: Credit = { id: 1, productId: 1, name: "Anniversary free night", amountCents: 100, unit: "nights", cadence: "card_year", mode: "track", remind: false, startsOn: null, endsOn: null, sort: 0 };
const fixture: PortfolioData = {
  people: [{ id: 1, name: "Example", code: "Ex", email: null, sort: 0 }],
  products: [{ id: 1, slug: "hyatt", name: "World of Hyatt", shortName: "hyatt", issuer: "Chase", kind: "personal", annualFeeCents: 0 }],
  accounts: [{ id: 1, personId: 1, appliedOn: null, approvedOn: "2022-11-01", openedVia: "applied", status: "open", closedOn: null, bonus: null, bonusEarned: false, note: null }],
  holdings: [{ id: 1, accountId: 1, personId: 1, productId: 1, number: 1, startedOn: "2022-11-01", endedOn: null, change: "opened", annualFeeCents: 0, last4: null }],
  credits: [credit], uses: [], optOuts: [], rules: [],
};
const today = new Date(2026, 9, 1, 12);
const used = { id: 1, creditId: 1, holdingId: 1, periodKey: "CY2025", amountCents: 100, usedOn: null, recordedBy: null, source: "manual" as const };

test("free-night quantities retain usage, exports and approval-anniversary resets", () => {
  const portfolio = indexPortfolio({ ...fixture, uses: [used] });
  assert.equal(formatCreditAmount(credit), "1 night");
  assert.equal(formatCreditAmount(credit, 200), "2 nights");
  assert.equal(creditState(portfolio, credit, portfolio.holdings[0], today).kind, "used");
  const row = exportTables(portfolio, today).credits[1];
  assert.equal(row[2], 1);
  assert.equal(row[7], 0);
  assert.equal(row[8], "nights");
  assert.equal(exportTables(portfolio, today).credits[0][8], "unit");
  const reset = creditState(portfolio, credit, portfolio.holdings[0], new Date(2026, 10, 1, 12));
  assert.equal(reset.kind, "open");
  assert.equal(reset.kind === "open" && reset.period.key, "CY2026");
  assert.equal(reset.kind === "open" && reset.amountCents, 100);
});

test("free nights follow upstream tracking modes and retain recorded uses", () => {
  const autoCredit = { ...credit, mode: "auto" as const, amountCents: 200 };
  const auto = indexPortfolio({ ...fixture, credits: [autoCredit] });
  const state = creditState(auto, autoCredit, auto.holdings[0], today);
  assert.equal(state.kind, "used");
  assert.equal(state.kind === "used" && state.auto, true);
  assert.equal(creditSummary(auto, autoCredit, auto.holdings, today).remainingCents, 0);
  const partial = indexPortfolio({ ...auto, uses: [used] });
  assert.equal(creditState(partial, autoCredit, auto.holdings[0], today).kind, "partial");
  const skippedCredit = { ...credit, mode: "skip" as const };
  const skipped = indexPortfolio({ ...fixture, credits: [skippedCredit], uses: [used] });
  assert.equal(creditState(skipped, skippedCredit, skipped.holdings[0], today).kind, "off");
  assert.equal(exportTables(skipped, today).credits.length, 1);
  assert.equal(skipped.uses.length, 1);
});

test("free-night reminders and to-dos use nights and respect quiet tracking", () => {
  const reminderDay = new Date(2026, 9, 29, 12); // Two days before the card-year period ends.
  const quiet = indexPortfolio(fixture);
  const state = creditState(quiet, credit, quiet.holdings[0], reminderDay);
  assert.equal(creditIsDue(credit, state), false);
  assert.equal(dailyReminder(quiet, reminderDay), null);
  const remindingCredit = { ...credit, remind: true };
  const reminding = indexPortfolio({ ...fixture, credits: [remindingCredit] });
  const task = dueItems(reminding, reminderDay)[0];
  assert.match(dueText(reminding, task).text, /Anniversary free night 1 night/);
  assert.match(dailyReminder(reminding, reminderDay)!.body, /Anniversary free night 1 night/);
  assert.doesNotMatch(dailyReminder(reminding, reminderDay)!.body, /\$/);
});
