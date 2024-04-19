alter table "public"."event_group_registrations" add constraint "event_group_registrations_group_id_user_id_key" unique ("group_id", "user_id");
