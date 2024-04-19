alter table "public"."events" add column "city_string" text
 not null default ''::text;
