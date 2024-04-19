alter table "public"."event_groups"
  add constraint "event_groups_format_fkey"
  foreign key ("format")
  references "public"."event_group_formats"
  ("value") on update cascade on delete set null;
