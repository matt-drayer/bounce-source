CREATE  INDEX "event_match_games_match_id_key" on
  "public"."event_match_games" using btree ("match_id");
