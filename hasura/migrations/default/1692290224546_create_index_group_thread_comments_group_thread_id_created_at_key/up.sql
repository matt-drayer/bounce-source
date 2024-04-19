CREATE  INDEX "group_thread_comments_group_thread_id_created_at_key" on
  "public"."group_thread_comments" using btree ("group_thread_id", "created_at");
