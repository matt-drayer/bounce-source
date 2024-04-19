CREATE  INDEX "event_round_matches_winning_team_id_key" on
  "public"."event_round_matches" using btree ("winning_team_id");
