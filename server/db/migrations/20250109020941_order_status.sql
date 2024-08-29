-- +goose Up
-- +goose StatementBegin
-- add an enum column to the orders table
ALTER TABLE orders ADD COLUMN status VARCHAR(16) NOT NULL DEFAULT 'created';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE orders DROP COLUMN IF EXISTS status;
-- +goose StatementEnd
