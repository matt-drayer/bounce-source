CREATE TABLE "public"."event_matches" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "round_id" uuid NOT NULL, "winning_team_id" uuid, "losing_team_id" uuid, "win_reason" text, "event_court_id" uuid, "court_number" integer, "pool_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("event_court_id") REFERENCES "public"."event_courts"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("losing_team_id") REFERENCES "public"."event_teams"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("round_id") REFERENCES "public"."event_pool_rounds"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("pool_id") REFERENCES "public"."event_group_pools"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("winning_team_id") REFERENCES "public"."event_teams"("id") ON UPDATE cascade ON DELETE set null);COMMENT ON TABLE "public"."event_matches" IS E'NOTE: In the product direction, the concept of a round is becoming less structured. Currently over-structuring this until we understand what columns aren\'t needing. May add or remove some foreign keys, and potentially tie to and event or group.';
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
CREATE TRIGGER "set_public_event_matches_updated_at"
BEFORE UPDATE ON "public"."event_matches"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_matches_updated_at" ON "public"."event_matches"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
