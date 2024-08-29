-- +goose Up
-- +goose StatementBegin
CREATE TABLE menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

CREATE OR REPLACE FUNCTION updated_at_unix_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := EXTRACT(EPOCH FROM NOW())::BIGINT;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_unix_timestamp
BEFORE UPDATE ON menus
FOR EACH ROW
EXECUTE FUNCTION updated_at_unix_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE menus;
DROP FUNCTION updated_at_unix_timestamp;
DROP TRIGGER set_updated_unix_timestamp;
-- +goose StatementEnd
