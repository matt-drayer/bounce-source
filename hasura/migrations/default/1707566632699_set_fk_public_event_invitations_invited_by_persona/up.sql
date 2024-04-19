alter table "public"."event_invitations"
  add constraint "event_invitations_invited_by_persona_fkey"
  foreign key ("invited_by_persona")
  references "public"."app_personas"
  ("value") on update cascade on delete set null;
