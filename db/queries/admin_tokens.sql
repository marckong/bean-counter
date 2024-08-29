-- name: GetAdminToken :one
SELECT * FROM admin_tokens WHERE token = $1 LIMIT 1;

-- name: CreateAdminToken :one
INSERT INTO admin_tokens (token) VALUES ($1) RETURNING *;
