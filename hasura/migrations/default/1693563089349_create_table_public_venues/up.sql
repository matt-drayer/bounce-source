CREATE TABLE "public"."venues" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "title" text NOT NULL, "address_string" text NOT NULL, "total_court_count" integer NOT NULL DEFAULT 0, "indoor_court_count" integer NOT NULL DEFAULT 0, "outdoor_court_count" integer NOT NULL DEFAULT 0, "latitude" numeric NOT NULL, "longitude" numeric NOT NULL, "coordinates_wkb" text NOT NULL, "city_id" uuid, "facility_type" text, "email" text NOT NULL, "phone_number" text NOT NULL, "website_url" text NOT NULL, "has_pickleball" boolean NOT NULL, "access_type" text, "slug" text NOT NULL, "description" text NOT NULL, "access_details" text NOT NULL, "schedule_details" text NOT NULL, "has_reservations" boolean, "featured_priority" integer, "is_active" boolean NOT NULL DEFAULT true, "should_hide_default_description" boolean NOT NULL DEFAULT false, "timezone" text NOT NULL, "source_id" text, "source_name" text, "source_last_fetched_at" timestamptz, "source_last_updated_at" timestamptz, "source_city" text, "source_country" text, "source_state_short" text, "source_state_name" text, "source_country_slug" text, "source_state_slug" text, "source_city_slug" text, "source_city_id" text, "pickleball_lines" text, "pickleball_nets" text, PRIMARY KEY ("id") , FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("facility_type") REFERENCES "public"."venue_facility_types"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("access_type") REFERENCES "public"."venue_access_types"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("pickleball_lines") REFERENCES "public"."venue_lines"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("pickleball_nets") REFERENCES "public"."venue_nets"("value") ON UPDATE cascade ON DELETE set null, UNIQUE ("slug"), UNIQUE ("source_id"));
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
CREATE TRIGGER "set_public_venues_updated_at"
BEFORE UPDATE ON "public"."venues"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_venues_updated_at" ON "public"."venues"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
