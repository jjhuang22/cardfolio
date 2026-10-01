import assert from "node:assert/strict";
import test from "node:test";
import { creditAmount, creditState, creditSummary, formatCreditAmount } from "../app/lib/core/credits.ts";
import { exportTables } from "../app/lib/core/export.ts";
import { indexPortfolio, type Credit, type PortfolioData } from "../app/lib/core/model.ts";

const credit: Credit = { id: 1, productId: 1, name: "Uber Cash", amountCents: 1500, monthlyAmounts: { "12": 3500 }, cadence: "monthly", remind: true, startsOn: null, endsOn: null, sort: 0 };
const fixture: PortfolioData = {
  people: [{ id: 1, name: "Example", code: "EX", email: null, sort: 0 }],
  products: [{ id: 1, slug: "plat", name: "Platinum", shortName: "plat", issuer: "Amex", kind: "personal", annualFeeCents: 89500 }],
  accounts: [{ id: 1, personId: 1, appliedOn: null, approvedOn: "2022-11-01", openedVia: "applied", status: "open", closedOn: null, bonus: null, bonusEarned: false, note: null }],
  holdings: [{ id: 1, accountId: 1, personId: 1, productId: 1, number: 1, startedOn: "2022-11-01", endedOn: null, change: "opened", annualFeeCents: 89500, last4: null }],
  credits: [credit], uses: [], optOuts: [], rules: [],
};

test("Uber Cash resets to $35 in December and $15 in January; $15 is only partially used in December", () => {
  assert.equal(creditAmount(credit, new Date(2026, 10, 1, 12)), 1500);
  assert.equal(creditAmount(credit, new Date(2026, 11, 1, 12)), 3500);
  assert.equal(creditAmount(credit, new Date(2027, 0, 1, 12)), 1500);
  const portfolio = indexPortfolio({ ...fixture, uses: [{ id: 1, creditId: 1, holdingId: 1, periodKey: "2026-12", amountCents: 1500, usedOn: null, recordedBy: null, source: "manual" }] });
  const today = new Date(2026, 11, 15, 12);
  assert.equal(creditState(portfolio, credit, portfolio.holdings[0], today).kind, "partial");
  assert.equal(creditSummary(portfolio, credit, portfolio.holdings, today).remainingCents, 2000);
  assert.equal(exportTables(portfolio, today).credits[1][2], 35);
});

test("Hyatt free nights retain their quantity and unit in tracking and exports", () => {
  const night: Credit = { ...credit, name: "Anniversary free night", amountCents: 100, unit: "nights", cadence: "card_year", monthlyAmounts: {} };
  const today = new Date(2026, 9, 1, 12);
  const portfolio = indexPortfolio({ ...fixture, credits: [night], uses: [{ id: 1, creditId: 1, holdingId: 1, periodKey: "CY2025", amountCents: 100, usedOn: null, recordedBy: null, source: "manual" }] });
  assert.equal(formatCreditAmount(night), "1 night");
  assert.equal(creditState(portfolio, night, portfolio.holdings[0], today).kind, "used");
  assert.equal(exportTables(portfolio, today).credits[1][8], "nights");
  assert.equal(creditState(portfolio, night, portfolio.holdings[0], new Date(2026, 10, 1, 12)).kind, "open");
});
