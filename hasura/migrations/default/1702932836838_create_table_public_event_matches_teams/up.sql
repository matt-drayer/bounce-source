CREATE TABLE "public"."event_matches_teams" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "match_id" uuid NOT NULL, "team_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("match_id") REFERENCES "public"."event_round_matches"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("team_id") REFERENCES "public"."event_teams"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("match_id", "team_id"));
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
CREATE TRIGGER "set_public_event_matches_teams_updated_at"
BEFORE UPDATE ON "public"."event_matches_teams"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_matches_teams_updated_at" ON "public"."event_matches_teams"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
