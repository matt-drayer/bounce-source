CREATE TABLE "public"."event_game_scores" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "game_id" uuid NOT NULL, "team_id" uuid NOT NULL, "score" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("game_id") REFERENCES "public"."event_match_games"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("team_id") REFERENCES "public"."event_teams"("id") ON UPDATE cascade ON DELETE set null, UNIQUE ("game_id", "team_id"));
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
CREATE TRIGGER "set_public_event_game_scores_updated_at"
BEFORE UPDATE ON "public"."event_game_scores"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_game_scores_updated_at" ON "public"."event_game_scores"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
