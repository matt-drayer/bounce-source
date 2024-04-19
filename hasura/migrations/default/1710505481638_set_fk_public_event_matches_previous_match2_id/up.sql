alter table "public"."event_matches"
  add constraint "event_matches_previous_match2_id_fkey"
  foreign key ("previous_match2_id")
  references "public"."event_matches"
  ("id") on update cascade on delete set null;
