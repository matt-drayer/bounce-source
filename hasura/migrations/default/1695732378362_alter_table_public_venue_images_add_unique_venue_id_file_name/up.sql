alter table "public"."venue_images" add constraint "venue_images_venue_id_file_name_key" unique ("venue_id", "file_name");
