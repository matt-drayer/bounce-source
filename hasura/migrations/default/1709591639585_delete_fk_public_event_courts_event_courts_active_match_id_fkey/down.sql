alter table "public"."event_courts"
  add constraint "event_courts_active_match_id_fkey"
  foreign key ("active_match_id")
  references "public"."event_round_matches"
  ("id") on update cascade on delete set null;
