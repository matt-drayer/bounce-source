CREATE  INDEX "event_transaction_items_transaction_id_key" on
  "public"."event_transaction_items" using btree ("transaction_id");
