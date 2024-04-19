CREATE  INDEX "play_session_comments_play_session_id_key" on
  "public"."play_session_comments" using btree ("play_session_id");
