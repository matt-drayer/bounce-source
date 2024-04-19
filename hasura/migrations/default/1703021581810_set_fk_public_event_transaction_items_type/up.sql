alter table "public"."event_transaction_items"
  add constraint "event_transaction_items_type_fkey"
  foreign key ("type")
  references "public"."event_transaction_item_types"
  ("value") on update cascade on delete set null;
