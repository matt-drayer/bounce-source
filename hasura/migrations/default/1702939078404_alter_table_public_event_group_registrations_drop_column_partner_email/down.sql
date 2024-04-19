alter table "public"."event_group_registrations" alter column "partner_email" drop not null;
alter table "public"."event_group_registrations" add column "partner_email" text;
