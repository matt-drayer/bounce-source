CREATE TABLE "public"."event_courts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "event_id" uuid NOT NULL, "active_event_group_id" uuid, "active_event_group_pool_id" uuid, "active_match_id" uuid, "court_number" integer NOT NULL, "court_status" text NOT NULL DEFAULT 'ACTIVE', PRIMARY KEY ("id") , FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("active_event_group_id") REFERENCES "public"."event_groups"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("active_event_group_pool_id") REFERENCES "public"."event_group_pools"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("active_match_id") REFERENCES "public"."event_round_matches"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("court_status") REFERENCES "public"."event_court_statuses"("value") ON UPDATE cascade ON DELETE set default, UNIQUE ("event_id", "court_number"));COMMENT ON TABLE "public"."event_courts" IS E'Note: This table may be overly structured with the foreign keys. Consider removing some if they\'re not needed.';
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
CREATE TRIGGER "set_public_event_courts_updated_at"
BEFORE UPDATE ON "public"."event_courts"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_courts_updated_at" ON "public"."event_courts"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
