alter table "public"."play_sessions"
  add constraint "play_sessions_privacy_fkey"
  foreign key ("privacy")
  references "public"."play_session_privacy"
  ("value") on update cascade on delete set default;
