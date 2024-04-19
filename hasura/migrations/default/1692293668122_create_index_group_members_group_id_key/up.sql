CREATE  INDEX "group_members_group_id_key" on
  "public"."group_members" using btree ("group_id");
