alter table "public"."users" drop constraint "users_username_check";
alter table "public"."users" add constraint "users_username_check" check (CHECK (username IS NULL OR username = lower(username) AND length(username) >= 4 AND length(username) <= 28 AND username ~ '^[a-z0-9_.-]*$'::text));
