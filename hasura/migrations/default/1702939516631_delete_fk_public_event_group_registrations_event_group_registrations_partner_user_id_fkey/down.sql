alter table "public"."event_group_registrations"
  add constraint "event_group_registrations_partner_user_id_fkey"
  foreign key ("partner_user_id")
  references "public"."users"
  ("id") on update cascade on delete set null;
