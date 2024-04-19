CREATE  INDEX "event_matches_winning_team_id_key" on
  "public"."event_matches" using btree ("winning_team_id");
