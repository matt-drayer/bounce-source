alter table "public"."users"
  add constraint "users_default_coach_payment_fulfillment_channel_fkey"
  foreign key ("default_coach_payment_fulfillment_channel")
  references "public"."payment_fulfillment_channels"
  ("value") on update cascade on delete set null;
