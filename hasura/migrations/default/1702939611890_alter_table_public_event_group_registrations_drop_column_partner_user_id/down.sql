alter table "public"."event_group_registrations" alter column "partner_user_id" drop not null;
alter table "public"."event_group_registrations" add column "partner_user_id" uuid;
