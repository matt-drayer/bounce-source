CREATE  INDEX "venue_follows_venue_id_status_key" on
  "public"."venue_follows" using btree ("venue_id", "status");
