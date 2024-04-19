alter table "public"."events"
  add constraint "events_status_fkey"
  foreign key ("status")
  references "public"."event_statuses"
  ("value") on update cascade on delete set null;
