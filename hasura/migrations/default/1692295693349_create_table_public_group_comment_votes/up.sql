CREATE TABLE "public"."group_comment_votes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "group_thread_comment_id" uuid NOT NULL, "user_id" uuid NOT NULL, "vote" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("group_thread_comment_id") REFERENCES "public"."group_thread_comments"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("vote") REFERENCES "public"."comment_vote"("value") ON UPDATE cascade ON DELETE restrict, UNIQUE ("group_thread_comment_id", "user_id"));
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
CREATE TRIGGER "set_public_group_comment_votes_updated_at"
BEFORE UPDATE ON "public"."group_comment_votes"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_group_comment_votes_updated_at" ON "public"."group_comment_votes"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
