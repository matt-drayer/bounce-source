alter table "public"."events" add column "source_is_featured" boolean
 not null default 'false';
