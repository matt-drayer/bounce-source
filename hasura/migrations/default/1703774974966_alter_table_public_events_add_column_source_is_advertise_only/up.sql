alter table "public"."events" add column "source_is_advertise_only" boolean
 not null default 'false';
