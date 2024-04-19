ALTER TABLE "public"."event_group_registrations" DROP CONSTRAINT if exists "event_group_registrations_registration_id_fkey";
ALTER TABLE "public"."event_group_registrations" DROP COLUMN if exists "registration_id";
