alter table "public"."event_group_sequences"
  add constraint "event_group_sequences_format_fkey"
  foreign key (format)
  references "public"."competition_formats"
  (value) on update cascade on delete set null;
alter table "public"."event_group_sequences" alter column "format" drop not null;
alter table "public"."event_group_sequences" add column "format" text;
