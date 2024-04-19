alter table "public"."play_sessions"
  add constraint "play_sessions_tennis_rating_scale_id_fkey"
  foreign key ("tennis_rating_scale_id")
  references "public"."tennis_rating_scales"
  ("id") on update cascade on delete set null;
