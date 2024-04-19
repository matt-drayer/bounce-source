CREATE TABLE "public"."event_group_registrations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "user_id" uuid NOT NULL, "group_id" uuid NOT NULL, "team_id" uuid NOT NULL, "registration_id" UUID NOT NULL, "partner_user_id" uuid, "partner_email" text NOT NULL, "status" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("group_id") REFERENCES "public"."event_groups"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("registration_id") REFERENCES "public"."event_registrations"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("team_id") REFERENCES "public"."event_teams"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE set null);
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
CREATE TRIGGER "set_public_event_group_registrations_updated_at"
BEFORE UPDATE ON "public"."event_group_registrations"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_event_group_registrations_updated_at" ON "public"."event_group_registrations"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
