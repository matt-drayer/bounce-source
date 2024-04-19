ALTER TABLE "public"."users" ALTER COLUMN "stripe_merchant_currency" drop default;
alter table "public"."users" alter column "stripe_merchant_currency" drop not null;
