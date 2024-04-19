CREATE TABLE "public"."groups" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "title" text NOT NULL, "slug" text NOT NULL, "city_id" uuid NOT NULL, "description" text NOT NULL DEFAULT '''', "contact_url" text, "contact_email" text, "contact_phone_number" text, "contact_message" text, "headline" text NOT NULL DEFAULT '''', "is_private" boolean NOT NULL DEFAULT false, "allow_member_invites" boolean NOT NULL DEFAULT true, "display_owner_contact_info" boolean NOT NULL DEFAULT true, "skill_level_minimum" numeric, "skill_level_maximum" numeric, "primary_sport" text, "allow_member_session_invites" boolean NOT NULL DEFAULT true, "profile_photo_url" text NOT NULL DEFAULT '''', "cover_photo_url" text NOT NULL DEFAULT '''', "owner_user_id" uuid, PRIMARY KEY ("id") , FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("primary_sport") REFERENCES "public"."sports"("value") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE set null, UNIQUE ("slug"));
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
CREATE TRIGGER "set_public_groups_updated_at"
BEFORE UPDATE ON "public"."groups"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_groups_updated_at" ON "public"."groups"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
