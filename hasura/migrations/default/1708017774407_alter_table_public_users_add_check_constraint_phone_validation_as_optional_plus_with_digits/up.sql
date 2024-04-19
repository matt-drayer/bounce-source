alter table "public"."users" add constraint "phone_validation_as_optional_plus_with_digits" check (phone_number ~ '^\+?\d+$');
