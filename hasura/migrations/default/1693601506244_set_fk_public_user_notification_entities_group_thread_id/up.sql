alter table "public"."user_notification_entities"
  add constraint "user_notification_entities_group_thread_id_fkey"
  foreign key ("group_thread_id")
  references "public"."group_threads"
  ("id") on update restrict on delete restrict;
