alter table "public"."group_thread_comments"
  add constraint "group_thread_comments_group_root_comment_id_fkey"
  foreign key ("group_root_comment_id")
  references "public"."group_thread_comments"
  ("id") on update cascade on delete set null;
