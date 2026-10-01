-- Preserve the chosen letter casing in cardholder abbreviations.
alter table public.people drop constraint people_code_check;
alter table public.people add constraint people_code_check
  check (code is null or code ~ '^[A-Za-z]{1,4}$');
