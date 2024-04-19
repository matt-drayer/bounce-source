alter table "public"."users" add column "stripe_merchant_currency" text
 not null default 'usd';
