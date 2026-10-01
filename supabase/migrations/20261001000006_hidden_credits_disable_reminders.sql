-- Hidden credits should not create tasks or notifications.
update public.credits set remind = false where hidden;
alter table public.credits add constraint credits_hidden_no_reminders
  check (not (hidden and remind));
