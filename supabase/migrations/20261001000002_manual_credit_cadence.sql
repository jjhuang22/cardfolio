-- Multi-year fee reimbursements need the last claim date; do not pretend they reset annually.
alter table public.credits drop constraint credits_cadence_check;
alter table public.credits add constraint credits_cadence_check
  check (cadence in ('monthly', 'quarterly', 'semiannual', 'calendar_year', 'card_year', 'manual'));
