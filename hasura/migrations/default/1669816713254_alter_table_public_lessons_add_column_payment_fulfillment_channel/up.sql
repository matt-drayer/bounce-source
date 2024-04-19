alter table "public"."lessons" add column "payment_fulfillment_channel" text
 not null default 'ON_PLATFORM';
