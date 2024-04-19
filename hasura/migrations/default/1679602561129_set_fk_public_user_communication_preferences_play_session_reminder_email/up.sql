alter table "public"."user_communication_preferences"
  add constraint "user_communication_preferences_play_session_reminder_email_f"
  foreign key ("play_session_reminder_email")
  references "public"."communication_preference_statuses"
  ("value") on update cascade on delete set default;
