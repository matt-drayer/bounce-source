CREATE TABLE "public"."venue_follows" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "venue_id" uuid NOT NULL, "user_id" uuid NOT NULL, "status" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("status") REFERENCES "public"."follow_statuses"("value") ON UPDATE cascade ON DELETE set null, UNIQUE ("venue_id", "user_id"));
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
CREATE TRIGGER "set_public_venue_follows_updated_at"
BEFORE UPDATE ON "public"."venue_follows"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_venue_follows_updated_at" ON "public"."venue_follows"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
