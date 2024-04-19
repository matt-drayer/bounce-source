CREATE  INDEX "group_comment_votes_group_thread_comment_id_key" on
  "public"."group_comment_votes" using btree ("group_thread_comment_id");
