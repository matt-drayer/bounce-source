alter table "public"."users"
  add constraint "users_event_organizer_account_type_fkey"
  foreign key ("event_organizer_account_type")
  references "public"."event_organizer_account_types"
  ("value") on update cascade on delete set default;
