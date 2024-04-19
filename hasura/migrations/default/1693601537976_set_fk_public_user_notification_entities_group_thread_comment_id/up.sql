alter table "public"."user_notification_entities"
  add constraint "user_notification_entities_group_thread_comment_id_fkey"
  foreign key ("group_thread_comment_id")
  references "public"."group_thread_comments"
  ("id") on update cascade on delete set null;
