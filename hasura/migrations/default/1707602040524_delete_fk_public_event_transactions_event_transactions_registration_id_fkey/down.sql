alter table "public"."event_transactions"
  add constraint "event_transactions_registration_id_fkey"
  foreign key ("registration_id")
  references "public"."event_registrations"
  ("id") on update cascade on delete set null;
