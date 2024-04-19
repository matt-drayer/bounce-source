alter table "public"."event_round_matches"
  add constraint "event_round_matches_event_court_id_fkey"
  foreign key ("event_court_id")
  references "public"."event_courts"
  ("id") on update cascade on delete set null;
