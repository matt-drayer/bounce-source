alter table "public"."events" alter column "contact_email" drop not null;
alter table "public"."events" add column "contact_email" text;
