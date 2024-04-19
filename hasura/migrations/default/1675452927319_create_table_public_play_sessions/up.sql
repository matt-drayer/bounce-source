CREATE TABLE "public"."play_sessions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "organizer_user_id" uuid, "status" text NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "canceled_at" timestamptz, "cancel_reason" text NOT NULL, "user_custom_court_id" uuid, "start_date_time" timestamptz, "end_date_time" timestamptz, "reminder_event_id" uuid, "published_at" timestamptz, "participant_limit" integer, "timezone_name" text NOT NULL, "timezone_offset_minutes" integer NOT NULL DEFAULT 0, "timezone_abbreviation" integer NOT NULL, "locale" text NOT NULL DEFAULT 'en-US', "sport" text NOT NULL, "format" text NOT NULL, "competitiveness" text, "target_skill_level" text, "court_booking_status" text NOT NULL, "price_unit_amount" integer NOT NULL DEFAULT 0, "currency" text NOT NULL DEFAULT 'USD', "extra_racket_count" integer, "is_bringing_net" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("organizer_user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("status") REFERENCES "public"."play_session_statuses"("value") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("user_custom_court_id") REFERENCES "public"."user_custom_courts"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("sport") REFERENCES "public"."sports"("value") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("format") REFERENCES "public"."play_session_formats"("value") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("competitiveness") REFERENCES "public"."play_session_match_competitiveness"("value") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("target_skill_level") REFERENCES "public"."skill_levels"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("court_booking_status") REFERENCES "public"."play_session_court_booking_statuses"("value") ON UPDATE cascade ON DELETE set null);
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
CREATE TRIGGER "set_public_play_sessions_updated_at"
BEFORE UPDATE ON "public"."play_sessions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_play_sessions_updated_at" ON "public"."play_sessions" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
