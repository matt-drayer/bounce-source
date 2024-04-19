alter table "public"."users"
  add constraint "users_default_sport_fkey"
  foreign key ("default_sport")
  references "public"."sports"
  ("value") on update cascade on delete set null;
