alter table "public"."event_group_sequences" add constraint "event_group_sequences_group_id_order_key" unique ("group_id", "order");
