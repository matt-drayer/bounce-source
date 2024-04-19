CREATE TABLE "public"."skill_levels" ("id" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "display_name" text NOT NULL, "rank" integer NOT NULL, "is_displayed" boolean NOT NULL DEFAULT true, PRIMARY KEY ("id") , UNIQUE ("rank"), CONSTRAINT "skill_levels_rank_check" CHECK (rank >= 0));
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
CREATE TRIGGER "set_public_skill_levels_updated_at"
BEFORE UPDATE ON "public"."skill_levels"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_skill_levels_updated_at" ON "public"."skill_levels" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
