alter table "public"."events"
  add constraint "events_group_format_fkey"
  foreign key ("group_format")
  references "public"."event_group_formats"
  ("value") on update cascade on delete set null;
