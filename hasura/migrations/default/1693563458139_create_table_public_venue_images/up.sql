CREATE TABLE "public"."venue_images" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "url" text NOT NULL, "source" text NOT NULL, "is_visible" boolean NOT NULL, "attribution_url" text NOT NULL, "attribution_html" text NOT NULL, "attribution_name" text NOT NULL, "file_name" text NOT NULL, "path" text NOT NULL, "provider" text NOT NULL, "provider_id" text NOT NULL, "provider_url" text NOT NULL, "venue_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_venue_images_updated_at"
BEFORE UPDATE ON "public"."venue_images"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_venue_images_updated_at" ON "public"."venue_images"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
