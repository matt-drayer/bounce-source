alter table "public"."event_transactions" add constraint "event_transactions_internal_stripe_payment_intent_id_key" unique ("internal_stripe_payment_intent_id");
