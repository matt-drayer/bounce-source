alter table "public"."event_invitations"
  add constraint "event_invitations_group_registration_id_fkey"
  foreign key ("group_registration_id")
  references "public"."event_group_registrations"
  ("id") on update cascade on delete set null;
