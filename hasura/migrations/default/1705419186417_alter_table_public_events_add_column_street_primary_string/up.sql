alter table "public"."events" add column "street_primary_string" text
 not null default ''::text;
