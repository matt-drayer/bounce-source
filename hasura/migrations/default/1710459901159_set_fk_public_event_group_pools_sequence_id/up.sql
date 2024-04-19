alter table "public"."event_group_pools"
  add constraint "event_group_pools_sequence_id_fkey"
  foreign key ("sequence_id")
  references "public"."event_group_sequences"
  ("id") on update cascade on delete cascade;
