alter table "public"."event_match_games"
  add constraint "event_match_games_match_id_fkey"
  foreign key ("match_id")
  references "public"."event_matches"
  ("id") on update cascade on delete set null;
