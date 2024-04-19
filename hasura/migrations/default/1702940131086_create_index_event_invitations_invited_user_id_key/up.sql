CREATE  INDEX "event_invitations_invited_user_id_key" on
  "public"."event_invitations" using btree ("invited_user_id");
