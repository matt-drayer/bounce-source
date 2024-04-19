CREATE TABLE "public"."event_group_sequence_seeding" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "event_group_sequence_id" uuid NOT NULL, "seed" integer NOT NULL, "event_team_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("event_group_sequence_id") REFERENCES "public"."event_group_sequences"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("event_team_id") REFERENCES "public"."event_teams"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("event_group_sequence_id", "seed"), UNIQUE ("event_group_sequence_id", "event_team_id"));
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
CREATE TRIGGER "set_public_event_group_sequence_seeding_updated_at"
BEFORE UPDATE ON "public"."event_group_sequence_seeding"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_group_sequence_seeding_updated_at" ON "public"."event_group_sequence_seeding"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
