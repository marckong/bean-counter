-- +goose Up
-- +goose StatementBegin
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

CREATE TABLE menus_menu_items (
  fk_menu_id uuid REFERENCES menus(id),
  fk_menu_item_id uuid REFERENCES menu_items(id)
);

CREATE INDEX menus_menu_items_idx ON menus_menu_items(fk_menu_id, fk_menu_item_id);

CREATE TRIGGER set_menu_items_updated_unix_timestamp
BEFORE UPDATE ON menu_items
FOR EACH ROW
EXECUTE FUNCTION updated_at_unix_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS set_menu_items_updated_unix_timestamp;
DROP INDEX IF EXISTS menu_item_fk_menu_id;
DROP TABLE IF EXISTS menus_menu_items;
DROP TABLE IF EXISTS menu_items;
-- +goose StatementEnd
