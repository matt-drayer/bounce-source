alter table "public"."event_group_sequences" alter column "is_round_complete" set default false;
alter table "public"."event_group_sequences" alter column "is_round_complete" drop not null;
alter table "public"."event_group_sequences" add column "is_round_complete" bool;
