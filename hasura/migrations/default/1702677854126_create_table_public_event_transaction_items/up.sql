CREATE TABLE "public"."event_transaction_items" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "transaction_id" uuid NOT NULL, "registration_id" uuid NOT NULL, "group_registration_id" uuid NOT NULL, "type" text NOT NULL, "price_unit_amount" integer NOT NULL, "total_unit_amount" integer NOT NULL, "refund_unit_amount" integer NOT NULL, "status" text NOT NULL, "refunded_at" timestamptz, "refunded_by_persona" text, PRIMARY KEY ("id") , FOREIGN KEY ("transaction_id") REFERENCES "public"."event_transactions"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("registration_id") REFERENCES "public"."event_registrations"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("group_registration_id") REFERENCES "public"."event_group_registrations"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("status") REFERENCES "public"."order_statuses"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("refunded_by_persona") REFERENCES "public"."app_personas"("value") ON UPDATE cascade ON DELETE set null);
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
CREATE TRIGGER "set_public_event_transaction_items_updated_at"
BEFORE UPDATE ON "public"."event_transaction_items"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_transaction_items_updated_at" ON "public"."event_transaction_items"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
