CREATE TABLE "public"."cities" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "name" text NOT NULL, "country_subdivision_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "latitude" numeric NOT NULL, "longitude" numeric NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("country_subdivision_id") REFERENCES "public"."country_subdivisions"("id") ON UPDATE cascade ON DELETE restrict);
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
CREATE TRIGGER "set_public_cities_updated_at"
BEFORE UPDATE ON "public"."cities"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_cities_updated_at" ON "public"."cities"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
