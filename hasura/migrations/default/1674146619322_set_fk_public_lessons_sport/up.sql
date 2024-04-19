alter table "public"."lessons"
  add constraint "lessons_sport_fkey"
  foreign key ("sport")
  references "public"."sports"
  ("value") on update cascade on delete restrict;
