alter table "public"."events" add column "zipcode_string" text
 not null default ''::text;
