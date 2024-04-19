alter table "public"."lesson_participants" add column "payment_fulfillment_channel" text
 not null default 'ON_PLATFORM';
