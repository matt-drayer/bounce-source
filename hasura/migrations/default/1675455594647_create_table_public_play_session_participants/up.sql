CREATE TABLE "public"."play_session_participants" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "play_session_id" uuid NOT NULL, "user_id" uuid NOT NULL, "status" text NOT NULL, "added_at" timestamptz, "added_by_persona" text, "added_by_user_id" uuid, "removed_at" timestamptz, "removed_by_persona" text, PRIMARY KEY ("id") , FOREIGN KEY ("added_by_persona") REFERENCES "public"."app_personas"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("removed_by_persona") REFERENCES "public"."app_personas"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("play_session_id") REFERENCES "public"."play_sessions"("id") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("status") REFERENCES "public"."play_session_statuses"("value") ON UPDATE cascade ON DELETE set null, UNIQUE ("play_session_id", "user_id"));
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
CREATE TRIGGER "set_public_play_session_participants_updated_at"
BEFORE UPDATE ON "public"."play_session_participants"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_play_session_participants_updated_at" ON "public"."play_session_participants" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
