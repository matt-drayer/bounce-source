alter table "public"."events" alter column "ball_type" set default 'NOT_SELECTED';
alter table "public"."events" alter column "ball_type" set not null;
