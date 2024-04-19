alter table "public"."play_sessions" add column "privacy" text
 not null default 'PUBLIC';
