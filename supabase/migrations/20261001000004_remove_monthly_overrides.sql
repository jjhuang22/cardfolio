-- Restore fixed amounts per period; keep free-night quantities.
alter table public.credits drop constraint credits_monthly_amounts_valid;
alter table public.credits drop column monthly_amounts;
drop function public.valid_credit_monthly_amounts(jsonb);
