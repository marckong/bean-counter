-- +goose Up
-- +goose StatementBegin
ALTER TABLE menus ADD COLUMN public_id varchar(255);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE menus DROP COLUMN IF EXISTS public_id;
-- +goose StatementEnd
