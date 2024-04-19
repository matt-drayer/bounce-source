alter table "public"."event_group_sequences"
  add constraint "event_group_sequences_complete_reason_fkey"
  foreign key ("complete_reason")
  references "public"."event_sequence_complete_reasons"
  ("value") on update cascade on delete set null;
