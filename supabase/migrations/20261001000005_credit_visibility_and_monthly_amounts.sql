-- Visibility is independent from enrollment, uses and reminders.
alter table public.credits
  add column hidden boolean not null default false,
  add column monthly_amounts jsonb not null default '{}'::jsonb;

create function public.valid_credit_monthly_amounts(amounts jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select case when jsonb_typeof(amounts) <> 'object' then false else
    not exists (
      select 1 from jsonb_each(amounts) as entry
      where entry.key !~ '^([1-9]|1[0-2])$'
        or jsonb_typeof(entry.value) <> 'number'
        or case when jsonb_typeof(entry.value) = 'number'
           then (entry.value::text)::numeric <= 0
             or (entry.value::text)::numeric > 2147483647
             or (entry.value::text)::numeric <> trunc((entry.value::text)::numeric)
           else false end
    ) end;
$$;

alter table public.credits add constraint credits_monthly_amounts_valid
  check (public.valid_credit_monthly_amounts(monthly_amounts));
