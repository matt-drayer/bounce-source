alter table "public"."user_communication_preferences" add column "play_session_participant_joined_push" text
 not null default 'ACTIVE';
