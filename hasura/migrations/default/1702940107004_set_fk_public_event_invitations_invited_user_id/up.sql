alter table "public"."event_invitations"
  add constraint "event_invitations_invited_user_id_fkey"
  foreign key ("invited_user_id")
  references "public"."users"
  ("id") on update cascade on delete set null;
