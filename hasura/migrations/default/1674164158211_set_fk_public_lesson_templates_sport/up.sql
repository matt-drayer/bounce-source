alter table "public"."lesson_templates"
  add constraint "lesson_templates_sport_fkey"
  foreign key ("sport")
  references "public"."sports"
  ("value") on update cascade on delete set null;
