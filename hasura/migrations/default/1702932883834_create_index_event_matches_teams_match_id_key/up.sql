CREATE  INDEX "event_matches_teams_match_id_key" on
  "public"."event_matches_teams" using btree ("match_id");
