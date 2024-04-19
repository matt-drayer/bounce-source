alter table "public"."event_pools_teams" add constraint "event_pools_teams_pool_id_team_id_key" unique ("pool_id", "team_id");
