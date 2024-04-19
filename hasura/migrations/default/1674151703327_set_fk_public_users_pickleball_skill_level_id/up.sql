alter table "public"."users"
  add constraint "users_pickleball_skill_level_id_fkey"
  foreign key ("pickleball_skill_level_id")
  references "public"."skill_levels"
  ("id") on update cascade on delete set null;
