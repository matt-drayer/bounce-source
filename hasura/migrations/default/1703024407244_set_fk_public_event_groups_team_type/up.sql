alter table "public"."event_groups"
  add constraint "event_groups_team_type_fkey"
  foreign key ("team_type")
  references "public"."team_types"
  ("value") on update cascade on delete set null;
