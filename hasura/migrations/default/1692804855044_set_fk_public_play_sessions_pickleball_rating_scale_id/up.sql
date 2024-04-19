alter table "public"."play_sessions"
  add constraint "play_sessions_pickleball_rating_scale_id_fkey"
  foreign key ("pickleball_rating_scale_id")
  references "public"."pickleball_rating_scales"
  ("id") on update cascade on delete set null;
