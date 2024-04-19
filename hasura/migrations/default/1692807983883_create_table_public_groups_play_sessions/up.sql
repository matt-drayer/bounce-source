CREATE TABLE "public"."groups_play_sessions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "group_id" uuid NOT NULL, "play_session_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("play_session_id") REFERENCES "public"."play_sessions"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("group_id", "play_session_id"));
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
CREATE TRIGGER "set_public_groups_play_sessions_updated_at"
BEFORE UPDATE ON "public"."groups_play_sessions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_groups_play_sessions_updated_at" ON "public"."groups_play_sessions"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
