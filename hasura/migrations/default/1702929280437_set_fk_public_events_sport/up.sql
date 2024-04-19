alter table "public"."events"
  add constraint "events_sport_fkey"
  foreign key ("sport")
  references "public"."sports"
  ("value") on update cascade on delete restrict;
