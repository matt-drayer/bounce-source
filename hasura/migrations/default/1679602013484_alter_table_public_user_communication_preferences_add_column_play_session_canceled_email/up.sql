alter table "public"."user_communication_preferences" add column "play_session_canceled_email" text
 not null default 'ACTIVE';
