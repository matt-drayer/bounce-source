alter table "public"."event_transactions"
  add constraint "event_transactions_event_id_fkey"
  foreign key ("event_id")
  references "public"."events"
  ("id") on update cascade on delete set null;
