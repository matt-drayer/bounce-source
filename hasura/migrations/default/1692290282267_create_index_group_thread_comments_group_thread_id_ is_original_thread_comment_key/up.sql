CREATE  INDEX "group_thread_comments_group_thread_id_ is_original_thread_comment_key" on
  "public"."group_thread_comments" using btree ("group_thread_id", "is_original_thread_comment");
