alter table "public"."play_session_participants"
  add constraint "play_session_participants_status_fkey"
  foreign key ("status")
  references "public"."play_session_statuses"
  ("value") on update cascade on delete set null;
