alter table "public"."event_group_registrations"
  add constraint "event_group_registrations_user_id_fkey1"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update cascade on delete set null;
