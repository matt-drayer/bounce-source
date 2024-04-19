CREATE  INDEX "event_transactions_external_stripe_payment_intent_id_key" on
  "public"."event_transactions" using btree ("external_stripe_payment_intent_id");
