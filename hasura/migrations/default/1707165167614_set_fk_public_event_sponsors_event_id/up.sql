alter table "public"."event_sponsors"
  add constraint "event_sponsors_event_id_fkey"
  foreign key ("event_id")
  references "public"."events"
  ("id") on update cascade on delete set null;
