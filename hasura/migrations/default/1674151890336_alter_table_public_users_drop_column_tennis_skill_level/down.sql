alter table "public"."users" alter column "tennis_skill_level" drop not null;
alter table "public"."users" add column "tennis_skill_level" text;
