alter table "public"."event_invitations"
  add constraint "event_invitations_status_fkey"
  foreign key ("status")
  references "public"."event_invitation_statuses"
  ("value") on update cascade on delete set null;
