CREATE  INDEX "group_thread_comment_files_group_thread_comment_id_key" on
  "public"."group_thread_comment_files" using btree ("group_thread_comment_id");
