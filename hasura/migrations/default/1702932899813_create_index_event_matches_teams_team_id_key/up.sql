CREATE  INDEX "event_matches_teams_team_id_key" on
  "public"."event_matches_teams" using btree ("team_id");
