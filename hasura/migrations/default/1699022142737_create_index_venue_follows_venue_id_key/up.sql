CREATE  INDEX "venue_follows_venue_id_key" on
  "public"."venue_follows" using btree ("venue_id");
