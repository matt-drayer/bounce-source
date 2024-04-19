alter table "public"."country_subdivisions" alter column "slug" set not null;
alter table "public"."country_subdivisions" add constraint "country_subdivisions_slug_key" unique ("slug");
