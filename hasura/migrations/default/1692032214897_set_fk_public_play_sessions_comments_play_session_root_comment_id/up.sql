alter table "public"."play_sessions_comments"
  add constraint "play_sessions_comments_play_session_root_comment_id_fkey"
  foreign key ("play_session_root_comment_id")
  references "public"."play_sessions_comments"
  ("id") on update cascade on delete set null;
