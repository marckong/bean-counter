-- +goose Up
-- +goose StatementBegin
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid REFERENCES menus(id),
  customer_name varchar(255) NOT NULL,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

CREATE TABLE orders_menu_items (
  fk_order_id uuid REFERENCES orders(id),
  fk_menu_item_id uuid REFERENCES menu_items(id)
);

CREATE INDEX orders_menu_items_idx ON orders_menu_items(fk_order_id, fk_menu_item_id);

CREATE TRIGGER set_orders_updated_unix_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION updated_at_unix_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS set_orders_updated_unix_timestamp;
DROP INDEX IF EXISTS orders_menu_items_idx;
DROP TABLE IF EXISTS orders_menu_items;
DROP INDEX IF EXISTS orders_menu_items_idx;

-- +goose StatementEnd
