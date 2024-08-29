-- +goose Up
-- +goose StatementBegin
CREATE TABLE admin_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token varchar(255) NOT NULL,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS admin_tokens;
-- +goose StatementEnd
