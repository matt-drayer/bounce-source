alter table "public"."play_session_comments"
  add constraint "play_session_comments_play_session_comment_id_fkey"
  foreign key ("play_session_comment_id")
  references "public"."play_session_comments"
  ("id") on update cascade on delete set null;
