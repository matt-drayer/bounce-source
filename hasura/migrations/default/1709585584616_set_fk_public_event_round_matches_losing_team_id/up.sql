alter table "public"."event_round_matches"
  add constraint "event_round_matches_losing_team_id_fkey"
  foreign key ("losing_team_id")
  references "public"."event_teams"
  ("id") on update cascade on delete set null;
