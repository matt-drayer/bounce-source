alter table "public"."users" add column "event_organizer_account_type" text
 not null default 'INACTIVE';
