CREATE TABLE "public"."events" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "title" text NOT NULL, "slug" text NOT NULL, "type" text NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "registration_deadline_date" date NOT NULL, "timezone_name" text NOT NULL, "timezone_offset_minutes" integer NOT NULL DEFAULT 0, "timezone_abbreviation" text NOT NULL, "status" text NOT NULL, "host_user_id" uuid NOT NULL, "canceled_at" timestamptz NOT NULL, "cancel_reason" text NOT NULL, "published_at" timestamptz, "locale" text NOT NULL DEFAULT 'en-US', "sport" text NOT NULL, "privacy" text NOT NULL DEFAULT 'PUBLIC', "scoring_format" text NOT NULL, "pickleball_rating_scale_id" uuid, "tennis_rating_scale_id" uuid, "registration_price_unit_amount" integer NOT NULL, "description" text NOT NULL, "contact_email" text NOT NULL, "prize_description" text NOT NULL, "has_prizes" boolean NOT NULL, "is_rating_required" boolean NOT NULL, "ball_used" text, "ball_custom_name" text NOT NULL, "latitude" numeric, "longitude" numeric, "geometry" geography, "venue_id" uuid, "city_id" uuid, "address_string" text, "source_id" text NOT NULL, "source_organizer_id" text NOT NULL, "source_logo_url" text NOT NULL, "source_venue_title" text NOT NULL, "source_location_street_address" text NOT NULL, "source_location_city" text NOT NULL, "source_location_country" text NOT NULL, "source_location_state" text NOT NULL, "source_location_zip" text NOT NULL, "is_external" boolean NOT NULL, "is_sanctioned" boolean NOT NULL, "display_location" text NOT NULL, "currency" text NOT NULL DEFAULT 'USD', PRIMARY KEY ("id") , FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("host_user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("tennis_rating_scale_id") REFERENCES "public"."tennis_rating_scales"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("pickleball_rating_scale_id") REFERENCES "public"."pickleball_rating_scales"("id") ON UPDATE cascade ON DELETE set null, UNIQUE ("slug"));
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
CREATE TRIGGER "set_public_events_updated_at"
BEFORE UPDATE ON "public"."events"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_events_updated_at" ON "public"."events"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
