CREATE TABLE "public"."event_sponsors" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "name" text NOT NULL, "is_title_sponsor" boolean NOT NULL, "category_name" text NOT NULL, "image_url" text NOT NULL, "image_file_name" text NOT NULL, "image_path" text NOT NULL, "image_host" text NOT NULL DEFAULT 'https://files.bounceassets.com', "image_file_type" text NOT NULL, "image_provider" text NOT NULL DEFAULT 'CLOUDFLARE', "image_provider_url" text NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_event_sponsors_updated_at"
BEFORE UPDATE ON "public"."event_sponsors"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_sponsors_updated_at" ON "public"."event_sponsors"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
