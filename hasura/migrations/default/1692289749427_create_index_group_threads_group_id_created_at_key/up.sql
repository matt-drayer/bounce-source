CREATE  INDEX "group_threads_group_id_created_at_key" on
  "public"."group_threads" using btree ("group_id", "created_at");
