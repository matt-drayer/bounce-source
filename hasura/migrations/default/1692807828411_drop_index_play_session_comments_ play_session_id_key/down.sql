CREATE  INDEX "play_session_comments_ play_session_id_key" on
  "public"."play_session_comments" using btree ("play_session_id");
