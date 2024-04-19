alter table "public"."event_match_games"
  add constraint "event_match_games_team1_id_fkey"
  foreign key ("team1_id")
  references "public"."event_teams"
  ("id") on update cascade on delete set null;
