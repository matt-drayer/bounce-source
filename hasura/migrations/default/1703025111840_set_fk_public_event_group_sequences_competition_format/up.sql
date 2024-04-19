alter table "public"."event_group_sequences"
  add constraint "event_group_sequences_competition_format_fkey"
  foreign key ("competition_format")
  references "public"."competition_formats"
  ("value") on update cascade on delete set null;
