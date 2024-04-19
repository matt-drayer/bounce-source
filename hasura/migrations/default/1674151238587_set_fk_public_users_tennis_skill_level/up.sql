alter table "public"."users"
  add constraint "users_tennis_skill_level_fkey"
  foreign key ("tennis_skill_level")
  references "public"."skill_levels"
  ("id") on update cascade on delete set null;
