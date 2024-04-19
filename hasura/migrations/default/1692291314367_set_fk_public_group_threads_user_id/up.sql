alter table "public"."group_threads"
  add constraint "group_threads_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update cascade on delete restrict;
