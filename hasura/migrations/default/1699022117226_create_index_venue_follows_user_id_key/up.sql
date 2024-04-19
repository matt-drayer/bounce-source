CREATE  INDEX "venue_follows_user_id_key" on
  "public"."venue_follows" using btree ("user_id");
