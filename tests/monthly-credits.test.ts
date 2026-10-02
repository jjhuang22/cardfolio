import assert from "node:assert/strict";
import test from "node:test";
import { creditAmount, creditState, creditSummary } from "../app/lib/core/credits.ts";
import { exportTables } from "../app/lib/core/export.ts";
import { indexPortfolio, type Credit, type PortfolioData } from "../app/lib/core/model.ts";
import { dailyReminder } from "../app/lib/core/reminders.ts";
import { dueItems } from "../app/lib/core/stats.ts";
import { dueText } from "../app/lib/presentation/due.ts";

const credit: Credit = { id: 1, productId: 1, name: "Uber Cash", amountCents: 1500, monthlyAmounts: { "12": 3500 }, cadence: "monthly", mode: "track", remind: true, startsOn: null, endsOn: null, sort: 0 };
const fixture: PortfolioData = {
  people: [{ id: 1, name: "Example", code: "Ex", email: null, sort: 0 }],
  products: [{ id: 1, slug: "plat", name: "Platinum", shortName: "plat", issuer: "Amex", kind: "personal", annualFeeCents: 0 }],
  accounts: [{ id: 1, personId: 1, appliedOn: null, approvedOn: "2022-11-01", openedVia: "applied", status: "open", closedOn: null, bonus: null, bonusEarned: false, note: null }],
  holdings: [{ id: 1, accountId: 1, personId: 1, productId: 1, number: 1, startedOn: "2022-11-01", endedOn: null, change: "opened", annualFeeCents: 0, last4: null }],
  credits: [credit], uses: [], optOuts: [], rules: [],
};
const december = new Date(2026, 11, 28, 12);

test("December Uber Cash replaces $15 with $35, and $15 remains a partial use", () => {
  assert.equal(creditAmount(credit, new Date(2026, 10, 1, 12)), 1500);
  assert.equal(creditAmount(credit, december), 3500);
  assert.equal(creditAmount(credit, new Date(2027, 0, 1, 12)), 1500);
  const portfolio = indexPortfolio({ ...fixture, uses: [{ id: 1, creditId: 1, holdingId: 1, periodKey: "2026-12", amountCents: 1500, usedOn: null, recordedBy: null, source: "manual" }] });
  const state = creditState(portfolio, credit, portfolio.holdings[0], december);
  assert.equal(state.kind, "partial");
  assert.equal(state.amountCents, 3500);
  assert.equal(creditSummary(portfolio, credit, portfolio.holdings, december).remainingCents, 2000);
  assert.equal(exportTables(portfolio, december).credits[1][2], 35);
  assert.equal(exportTables(portfolio, december).credits[1][7], 20);
  const task = dueItems(portfolio, december)[0];
  assert.match(dueText(portfolio, task).text, /Uber Cash \$35/);
  assert.match(dailyReminder(portfolio, december)!.body, /Uber Cash \$35/);
  assert.equal(creditState(portfolio, credit, portfolio.holdings[0], new Date(2027, 0, 1, 12)).kind, "open");
});

test("always-used and not-using modes retain upstream behavior with December amounts", () => {
  const autoCredit = { ...credit, mode: "auto" as const };
  const portfolio = indexPortfolio({ ...fixture, credits: [autoCredit] });
  const state = creditState(portfolio, autoCredit, portfolio.holdings[0], december);
  assert.equal(state.kind, "used");
  assert.equal(state.usedCents, 3500);
  assert.equal(state.auto, true);
  assert.equal(exportTables(portfolio, december).credits[1][7], 0);
  assert.equal(dailyReminder(portfolio, december), null);
  const skipped = indexPortfolio({ ...fixture, credits: [{ ...credit, mode: "skip" }] });
  assert.equal(exportTables(skipped, december).credits.length, 1);
  assert.equal(dailyReminder(skipped, december), null);
});
