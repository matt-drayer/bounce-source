alter table "public"."lesson_participants"
  add constraint "lesson_participants_payment_fulfillment_channel_fkey"
  foreign key ("payment_fulfillment_channel")
  references "public"."payment_fulfillment_channels"
  ("value") on update cascade on delete restrict;
