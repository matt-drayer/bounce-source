alter table "public"."country_subdivisions" drop constraint "country_subdivisions_slug_key";
alter table "public"."country_subdivisions" alter column "slug" drop not null;
