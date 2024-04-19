alter table "public"."events"
  add constraint "events_scoring_format_fkey"
  foreign key ("scoring_format")
  references "public"."scoring_format"
  ("value") on update cascade on delete set null;
