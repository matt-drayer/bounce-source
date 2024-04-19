alter table "public"."user_notification_entities"
  add constraint "user_notification_entities_group_id_fkey"
  foreign key ("group_id")
  references "public"."groups"
  ("id") on update cascade on delete set null;
