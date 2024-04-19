CREATE  INDEX "event_transactions_internal_stripe_payment_intent_id_key" on
  "public"."event_transactions" using btree ("internal_stripe_payment_intent_id");
