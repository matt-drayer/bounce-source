alter table "public"."event_match_games"
  add constraint "event_match_games_losing_team_id_fkey"
  foreign key ("losing_team_id")
  references "public"."event_teams"
  ("id") on update cascade on delete set null;
