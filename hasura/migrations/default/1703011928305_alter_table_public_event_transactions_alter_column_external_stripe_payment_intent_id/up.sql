alter table "public"."event_transactions" add constraint "event_transactions_external_stripe_payment_intent_id_key" unique ("external_stripe_payment_intent_id");
