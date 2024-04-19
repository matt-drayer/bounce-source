CREATE TABLE "public"."event_groups" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "event_id" uuid NOT NULL, "title" text NOT NULL, "format" text NOT NULL, "format_custom_name" text NOT NULL, "gender" text NOT NULL, "singles_doubles" text NOT NULL, "price_unit_amount" integer NOT NULL, "minimum_rating" numeric, "maximum_rating" numeric, "minimum_age" integer, "maximum_age" integer NOT NULL, "team_limit" integer NOT NULL, "minimum_number_of_games" integer NOT NULL, "scoring_type" text NOT NULL, "win_by" integer, "total_points" integer NOT NULL, "games_per_match" integer NOT NULL, "starts_at" timestamptz, "ends_at" timestamptz, PRIMARY KEY ("id") , FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE cascade ON DELETE set null);
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
CREATE TRIGGER "set_public_event_groups_updated_at"
BEFORE UPDATE ON "public"."event_groups"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_groups_updated_at" ON "public"."event_groups"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
