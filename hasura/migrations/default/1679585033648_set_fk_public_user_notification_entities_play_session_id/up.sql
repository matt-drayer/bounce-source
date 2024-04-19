alter table "public"."user_notification_entities"
  add constraint "user_notification_entities_play_session_id_fkey"
  foreign key ("play_session_id")
  references "public"."play_sessions"
  ("id") on update cascade on delete set null;
