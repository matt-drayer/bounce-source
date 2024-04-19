alter table "public"."event_matches"
  add constraint "event_matches_win_reason_fkey"
  foreign key ("win_reason")
  references "public"."win_reasons"
  ("value") on update cascade on delete set null;
