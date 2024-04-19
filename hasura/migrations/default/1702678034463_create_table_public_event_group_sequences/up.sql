CREATE TABLE "public"."event_group_sequences" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "group_id" uuid NOT NULL, "sequence_type" text NOT NULL, "sequence_order" integer NOT NULL, "next_sequence_id" uuid, "is_round_complete" boolean NOT NULL DEFAULT false, "round_complete_reason" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("group_id") REFERENCES "public"."event_groups"("id") ON UPDATE cascade ON DELETE set null);
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
CREATE TRIGGER "set_public_event_group_sequences_updated_at"
BEFORE UPDATE ON "public"."event_group_sequences"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_group_sequences_updated_at" ON "public"."event_group_sequences"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
