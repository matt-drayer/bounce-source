alter table "public"."event_match_games"
  add constraint "event_match_games_win_reason_fkey"
  foreign key ("win_reason")
  references "public"."win_reasons"
  ("value") on update cascade on delete set null;
