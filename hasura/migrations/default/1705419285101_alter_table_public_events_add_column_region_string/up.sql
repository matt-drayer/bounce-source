alter table "public"."events" add column "region_string" text
 not null default ''::text;
