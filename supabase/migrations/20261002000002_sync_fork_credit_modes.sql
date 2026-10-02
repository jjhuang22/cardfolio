-- Preserve the fork's visibility choices when adopting upstream tracking modes.
update public.credits set mode = 'skip' where hidden and mode = 'track';
alter table public.credits drop column hidden;

-- Upstream no longer displays free-night quantities. Retain their records, but
-- keep them out of dollar displays and exports until the owner reviews them.
update public.credits set mode = 'skip' where unit = 'nights';

-- The December amount replaces the ordinary monthly amount; it is not additive.
-- Preserve other overrides and the ordinary monthly amount.
update public.credits
set monthly_amounts = monthly_amounts || '{"12":3500}'::jsonb
where lower(trim(name)) = 'uber cash' and cadence = 'monthly';
