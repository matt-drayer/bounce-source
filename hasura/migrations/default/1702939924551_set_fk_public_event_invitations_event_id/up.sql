alter table "public"."event_invitations"
  add constraint "event_invitations_event_id_fkey"
  foreign key ("event_id")
  references "public"."events"
  ("id") on update cascade on delete set null;
