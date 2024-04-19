alter table "public"."lessons"
  add constraint "lessons_payment_fulfillment_channel_fkey"
  foreign key ("payment_fulfillment_channel")
  references "public"."payment_fulfillment_channels"
  ("value") on update cascade on delete restrict;
