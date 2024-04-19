CREATE  INDEX "event_matches_losing_team_id_key" on
  "public"."event_matches" using btree ("losing_team_id");
