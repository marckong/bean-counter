-- name: CreateMenu :one
INSERT INTO menus (name, public_id) VALUES ($1, $2) RETURNING *;

-- name: DeleteMenu :exec
DELETE FROM menus WHERE id = $1;

-- name: DeleteMenusMenuItems :exec
DELETE FROM menus_menu_items WHERE fk_menu_id = $1;

-- name: GetMenu :one
SELECT * FROM menus WHERE id = $1;

-- name: GetMenus :many
SELECT * FROM menus ORDER BY created_at DESC;

-- name: UpdateMenu :one
UPDATE menus SET name = $1 WHERE id = $2 RETURNING *;

-- name: GetMenuByPublicId :one
SELECT * FROM menus WHERE public_id = $1;