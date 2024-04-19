alter table "public"."event_team_members" add constraint "event_team_members_team_id_user_id_key" unique ("team_id", "user_id");
