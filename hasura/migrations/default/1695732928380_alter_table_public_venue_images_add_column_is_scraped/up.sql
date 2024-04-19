alter table "public"."venue_images" add column "is_scraped" boolean
 not null default 'false';
