alter table "public"."event_group_sequences" add column "is_sequence_complete" boolean
 not null default 'false';
