alter table "public"."user_communication_preferences"
  add constraint "user_communication_preferences_play_session_participant_join2"
  foreign key ("play_session_participant_joined_push")
  references "public"."communication_preference_statuses"
  ("value") on update cascade on delete set default;
