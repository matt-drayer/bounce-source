alter table "public"."event_transactions" alter column "registration_id" drop not null;
alter table "public"."event_transactions" add column "registration_id" uuid;
