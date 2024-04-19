alter table "public"."event_matches"
  add constraint "event_matches_team2_id_fkey"
  foreign key ("team2_id")
  references "public"."event_teams"
  ("id") on update cascade on delete set null;
