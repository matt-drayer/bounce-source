alter table "public"."play_sessions" alter column "pickleball_rating_scale" drop not null;
alter table "public"."play_sessions" add column "pickleball_rating_scale" uuid;
