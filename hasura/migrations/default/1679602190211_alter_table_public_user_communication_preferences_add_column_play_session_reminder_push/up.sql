alter table "public"."user_communication_preferences" add column "play_session_reminder_push" text
 not null default 'ACTIVE';
