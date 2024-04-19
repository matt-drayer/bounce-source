alter table "public"."users" alter column "pickleball_skill_level" drop not null;
alter table "public"."users" add column "pickleball_skill_level" text;
