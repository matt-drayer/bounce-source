alter table "public"."play_sessions"
  add constraint "play_sessions_venue_id_fkey"
  foreign key ("venue_id")
  references "public"."venues"
  ("id") on update cascade on delete set null;
