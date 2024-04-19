CREATE TABLE "public"."event_listing_fees" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "event_id" uuid NOT NULL, "user_id" uuid NOT NULL, "payment_processor" text NOT NULL, "status" text NOT NULL, "stripe_customer_id" text NOT NULL, "stripe_payment_status" text NOT NULL, "order_total_unit_amount" integer NOT NULL, "order_subtotal_unit_amount" integer NOT NULL, "paid_unit_amount" integer NOT NULL, "refund_unit_amount" integer NOT NULL, "internal_stripe_payment_intent_id" uuid NOT NULL, "external_stripe_payment_intent_id" text NOT NULL, "refunded_at" timestamptz, "refunded_by_persona" text, "user_credit_card_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("status") REFERENCES "public"."order_statuses"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("payment_processor") REFERENCES "public"."payment_processors"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("user_credit_card_id") REFERENCES "public"."user_credit_cards"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("refunded_by_persona") REFERENCES "public"."app_personas"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("internal_stripe_payment_intent_id") REFERENCES "public"."stripe_payment_intents"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("external_stripe_payment_intent_id") REFERENCES "public"."stripe_payment_intents"("payment_intent_id") ON UPDATE cascade ON DELETE set null, UNIQUE ("external_stripe_payment_intent_id"), UNIQUE ("internal_stripe_payment_intent_id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_event_listing_fees_updated_at"
BEFORE UPDATE ON "public"."event_listing_fees"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_listing_fees_updated_at" ON "public"."event_listing_fees"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
