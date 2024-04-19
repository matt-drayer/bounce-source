alter table "public"."user_notification_entities"
  add constraint "user_notification_entities_play_session_comment_id_fkey"
  foreign key ("play_session_comment_id")
  references "public"."play_session_comments"
  ("id") on update cascade on delete set null;
