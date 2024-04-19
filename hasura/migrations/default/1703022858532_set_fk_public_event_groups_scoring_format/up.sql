alter table "public"."event_groups"
  add constraint "event_groups_scoring_format_fkey"
  foreign key ("scoring_format")
  references "public"."scoring_format"
  ("value") on update cascade on delete set null;
