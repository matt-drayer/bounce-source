alter table "public"."events"
  add constraint "events_privacy_fkey"
  foreign key ("privacy")
  references "public"."event_privacy"
  ("value") on update cascade on delete set null;
