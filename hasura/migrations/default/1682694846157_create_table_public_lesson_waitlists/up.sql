CREATE TABLE "public"."lesson_waitlists" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "lesson_id" uuid NOT NULL, "user_id" uuid NOT NULL, "status" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("status") REFERENCES "public"."lesson_waitlist_statuses"("value") ON UPDATE cascade ON DELETE restrict, UNIQUE ("user_id", "lesson_id"));
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
CREATE TRIGGER "set_public_lesson_waitlists_updated_at"
BEFORE UPDATE ON "public"."lesson_waitlists"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_lesson_waitlists_updated_at" ON "public"."lesson_waitlists"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
