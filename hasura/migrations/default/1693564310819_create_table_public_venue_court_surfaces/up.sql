CREATE TABLE "public"."venue_court_surfaces" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "venue_id" uuid NOT NULL, "court_surface" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("court_surface") REFERENCES "public"."court_surfaces"("value") ON UPDATE cascade ON DELETE cascade, UNIQUE ("venue_id", "court_surface"));
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
CREATE TRIGGER "set_public_venue_court_surfaces_updated_at"
BEFORE UPDATE ON "public"."venue_court_surfaces"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_venue_court_surfaces_updated_at" ON "public"."venue_court_surfaces"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
