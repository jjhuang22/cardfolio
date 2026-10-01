-- Keep existing reset rules; custom multi-year tracking requires a separate decision.
alter table public.credits drop constraint credits_cadence_check;
alter table public.credits add constraint credits_cadence_check
  check (cadence in ('monthly', 'quarterly', 'semiannual', 'calendar_year', 'card_year'));
