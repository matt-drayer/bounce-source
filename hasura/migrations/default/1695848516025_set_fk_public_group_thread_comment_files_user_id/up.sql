alter table "public"."group_thread_comment_files"
  add constraint "group_thread_comment_files_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update cascade on delete cascade;
