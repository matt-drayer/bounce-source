alter table "public"."events"
  add constraint "events_type_fkey"
  foreign key ("type")
  references "public"."event_types"
  ("value") on update cascade on delete set null;
