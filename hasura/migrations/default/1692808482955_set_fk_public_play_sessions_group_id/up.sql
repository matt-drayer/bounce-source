alter table "public"."play_sessions"
  add constraint "play_sessions_group_id_fkey"
  foreign key ("group_id")
  references "public"."groups"
  ("id") on update cascade on delete set null;
