CREATE  INDEX "event_invitations_sender_user_id_event_id_key" on
  "public"."event_invitations" using btree ("sender_user_id", "event_id");
