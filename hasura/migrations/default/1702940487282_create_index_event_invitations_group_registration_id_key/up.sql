CREATE  INDEX "event_invitations_group_registration_id_key" on
  "public"."event_invitations" using btree ("group_registration_id");
