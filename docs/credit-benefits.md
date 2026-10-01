# Credits and reset periods

These are public benefit terms and application behavior, checked against issuer
pages on October 1, 2026. Household account records belong in Supabase, not Git.
An unchecked credit means no use has been recorded; it does not confirm issuer
enrollment or eligibility. Enrollment and qualifying purchases still apply.

## Existing documented Amex defaults

| Personal Platinum benefit | Amount per period | Reset |
|---|---:|---|
| Fine Hotels + Resorts / The Hotel Collection | $300 | Jan–Jun / Jul–Dec |
| Resy | $100 | Calendar quarter |
| lululemon | $75 | Calendar quarter |
| Airline incidental fees | $200 | Calendar year |
| Digital entertainment | $25 | Calendar month |
| Uber Cash | $15; $35 in December | Calendar month |
| Uber One | $120 | Calendar year |
| Walmart+ monthly membership | $12.95 plus applicable taxes | Calendar month |
| CLEAR+ | $219, excluding taxes and fees | Calendar year |
| Oura | $200 | Calendar year |
| Equinox | $300 | Calendar year |

Walmart+ tracks the base price, without calculating local taxes. Hotel bookings
must be prepaid through Amex Travel; The Hotel Collection requires two nights.
Uber Cash covers eligible U.S. rides/orders with the card added to Uber and an
Amex card selected for payment. Enrollment applies to benefits such as Resy,
lululemon, digital entertainment, Oura and Equinox.

| Business Platinum benefit | Amount per period | Reset |
|---|---:|---|
| Airline incidental fees | $200 | Calendar year |
| Dell base credit | $150 | Calendar year |
| Fine Hotels + Resorts / The Hotel Collection | $300 | Jan–Jun / Jul–Dec |
| Wireless | $10 | Calendar month |
| Hilton | $50 | Calendar quarter |
| CLEAR+ | $219, excluding taxes and fees | Calendar year |

Hilton requires enrollment and Hilton for Business requirements; wireless must
be paid directly to an eligible U.S. provider. CLEAR and wireless retain the
original low-priority reminder setting. These selected lists preserve the
previously documented defaults with corrected current amounts.

## Other included benefits

- Sapphire Preferred: $100 Chase Travel hotel credit per card year; $10 off one
  qualifying DoorDash non-restaurant order per calendar month with an activated
  eligible DashPass membership. DoorDash discounts do not roll over; unused
  portions of the single-order discount are forfeited.
- World of Hyatt: one Category 1–4 anniversary free night. Track **1 night**,
  without assigning a cash value. The card-year row tracks the annual benefit,
  not the inventory of issued certificates. Certificates expire 12 months after
  issuance, which can be later than the anniversary. Reminders remain off;
  actual certificate-expiration tracking would require separate approval.

Card years follow the app's existing approval-anniversary calculation. Chase's
hotel credit specifically follows an account anniversary and statement/billing
boundary; a month-only opening date cannot establish that precise boundary.

## Excluded or deferred

- Ink Cash Instacart is not in the default snapshot and is omitted by preference.
  Its current terms also limit the offer to one household.
- Hyatt's extra night after $15,000 calendar-year spending, Dell's additional
  $1,000 after $5,000 eligible annual spending, and Adobe's $250 after $600
  eligible annual spending are omitted by preference against spend thresholds.
- Business Platinum ChatGPT Business and Indeed credits are verified on the
  issuer page but outside the selected existing default list, so not added.
- Global Entry / TSA PreCheck / NEXUS reimbursements have multi-year eligibility
  limits. They are not annual credits. Custom reset or eligibility logic requires
  approval first; these benefits are not inserted into the current tracker.
- JetBlue Business's vacation credit appears in the source worksheet, but current
  Barclays pages returned HTTP 403. Amount, qualifying booking and cadence remain
  unverified; not added as a confirmed recurring credit.
- Per-stay hotel/property credits, venue percentage discounts, anniversary points,
  and DashPass membership are outside this selected recurring-credit list.
  Insurance, status benefits and lounge access are excluded.

## Sources

- [American Express Platinum](https://www.americanexpress.com/us/credit-cards/card/platinum/)
- [American Express Business Platinum](https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/)
- [Chase Sapphire Preferred](https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred)
- [World of Hyatt](https://creditcards.chase.com/travel-credit-cards/world-of-hyatt-credit-card)
- [Ink Business Cash](https://creditcards.chase.com/business-credit-cards/ink/cash)

## Implementation

Credit units are dollars or nights. Amounts and uses store hundredths of that
unit for compatibility. Night credits display a quantity and omit partial-dollar
entry. Monthly replacement amounts apply to usage status, remaining totals,
to-dos, notifications and exports. Credits CSV appends a unit column. Existing
records default to dollars with no monthly overrides. Reset rules remain the
original five cadences; no manual or multi-year reset logic is enabled.
