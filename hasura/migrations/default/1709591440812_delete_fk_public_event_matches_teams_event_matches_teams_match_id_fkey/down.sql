alter table "public"."event_matches_teams"
  add constraint "event_matches_teams_match_id_fkey"
  foreign key ("match_id")
  references "public"."event_round_matches"
  ("id") on update cascade on delete cascade;
