alter table "public"."events" add column "country_string" text
 not null default ''::text;
