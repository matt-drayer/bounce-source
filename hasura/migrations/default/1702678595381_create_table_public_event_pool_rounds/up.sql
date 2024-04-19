CREATE TABLE "public"."event_pool_rounds" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "pool_id" uuid NOT NULL, "title" text NOT NULL, "round_order" integer NOT NULL, "next_round_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("pool_id") REFERENCES "public"."event_group_pools"("id") ON UPDATE cascade ON DELETE set null);
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
CREATE TRIGGER "set_public_event_pool_rounds_updated_at"
BEFORE UPDATE ON "public"."event_pool_rounds"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_pool_rounds_updated_at" ON "public"."event_pool_rounds"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
