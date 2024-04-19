alter table "public"."event_matches"
  add constraint "event_matches_team1_id_fkey"
  foreign key ("team1_id")
  references "public"."event_teams"
  ("id") on update cascade on delete set null;
