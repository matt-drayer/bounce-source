alter table "public"."events" alter column "ball_type" drop not null;
ALTER TABLE "public"."events" ALTER COLUMN "ball_type" drop default;
