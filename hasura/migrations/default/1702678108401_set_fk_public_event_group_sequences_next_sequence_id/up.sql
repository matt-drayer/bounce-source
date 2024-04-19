alter table "public"."event_group_sequences"
  add constraint "event_group_sequences_next_sequence_id_fkey"
  foreign key ("next_sequence_id")
  references "public"."event_group_sequences"
  ("id") on update cascade on delete set null;
