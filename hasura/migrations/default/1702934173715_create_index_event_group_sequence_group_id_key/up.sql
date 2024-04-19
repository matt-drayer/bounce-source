CREATE  INDEX "event_group_sequence_group_id_key" on
  "public"."event_group_sequences" using btree ("group_id");
