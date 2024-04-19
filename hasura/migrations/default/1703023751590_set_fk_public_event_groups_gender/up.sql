alter table "public"."event_groups"
  add constraint "event_groups_gender_fkey"
  foreign key ("gender")
  references "public"."competition_gender"
  ("value") on update cascade on delete set null;
