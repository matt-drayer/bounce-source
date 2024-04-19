alter table "public"."event_matches"
  add constraint "event_matches_selection_criteria_previous_match2_fkey"
  foreign key ("selection_criteria_previous_match2")
  references "public"."match_selection_criteria"
  ("value") on update cascade on delete set null;
