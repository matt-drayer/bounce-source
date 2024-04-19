CREATE TABLE "public"."group_thread_comment_files" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "group_thread_comment_id" uuid NOT NULL, "is_visible" boolean NOT NULL DEFAULT true, "url" text NOT NULL, "host" text NOT NULL, "path" text NOT NULL, "file_name" text NOT NULL, "file_type" text NOT NULL, "provider" text NOT NULL, "provider_url" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("group_thread_comment_id") REFERENCES "public"."group_thread_comments"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_group_thread_comment_files_updated_at"
BEFORE UPDATE ON "public"."group_thread_comment_files"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_group_thread_comment_files_updated_at" ON "public"."group_thread_comment_files"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
