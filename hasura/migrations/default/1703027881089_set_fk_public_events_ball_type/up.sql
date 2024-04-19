alter table "public"."events"
  add constraint "events_ball_type_fkey"
  foreign key ("ball_type")
  references "public"."ball_types"
  ("value") on update cascade on delete set null;
