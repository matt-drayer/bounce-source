alter table "public"."event_group_registrations"
  add constraint "event_group_registrations_status_fkey"
  foreign key ("status")
  references "public"."event_group_registration_statuses"
  ("value") on update cascade on delete set null;
