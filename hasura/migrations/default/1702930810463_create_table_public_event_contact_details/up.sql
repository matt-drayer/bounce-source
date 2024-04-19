CREATE TABLE "public"."event_contact_details" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "event_id" uuid NOT NULL, "email" text NOT NULL, "phone_number" text NOT NULL, "contact_url" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("event_id"));
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
CREATE TRIGGER "set_public_event_contact_details_updated_at"
BEFORE UPDATE ON "public"."event_contact_details"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_contact_details_updated_at" ON "public"."event_contact_details"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
