CREATE TABLE "public"."play_sessions_comments" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "content" text NOT NULL, "play_session_id" uuid NOT NULL, "play_session_comment_id" uuid, "play_session_root_comment_id" uuid, PRIMARY KEY ("id") , FOREIGN KEY ("play_session_id") REFERENCES "public"."play_sessions"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_play_sessions_comments_updated_at"
BEFORE UPDATE ON "public"."play_sessions_comments"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_play_sessions_comments_updated_at" ON "public"."play_sessions_comments"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
