alter table "public"."event_pool_rounds"
  add constraint "event_pool_rounds_next_round_id_fkey"
  foreign key (next_round_id)
  references "public"."event_pool_rounds"
  (id) on update cascade on delete set null;
alter table "public"."event_pool_rounds" alter column "next_round_id" drop not null;
alter table "public"."event_pool_rounds" add column "next_round_id" uuid;
