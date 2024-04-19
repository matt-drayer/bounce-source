alter table "public"."play_session_comments"
  add constraint "play_session_comments_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update cascade on delete restrict;
