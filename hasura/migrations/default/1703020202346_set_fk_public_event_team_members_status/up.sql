alter table "public"."event_team_members"
  add constraint "event_team_members_status_fkey"
  foreign key ("status")
  references "public"."event_team_member_statuses"
  ("value") on update cascade on delete set null;
