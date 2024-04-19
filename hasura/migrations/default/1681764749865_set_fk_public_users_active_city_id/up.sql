alter table "public"."users"
  add constraint "users_active_city_id_fkey"
  foreign key ("active_city_id")
  references "public"."cities"
  ("id") on update cascade on delete set null;
