alter table "public"."users" alter column "stripe_merchant_currency" set not null;
alter table "public"."users" alter column "stripe_merchant_currency" set default 'usd'::text;
