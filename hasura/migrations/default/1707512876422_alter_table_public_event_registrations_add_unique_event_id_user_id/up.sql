alter table "public"."event_registrations" add constraint "event_registrations_event_id_user_id_key" unique ("event_id", "user_id");
