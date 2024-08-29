-- name: CreateMenuItem :one
INSERT INTO menu_items (name) VALUES ($1) RETURNING *;

-- name: GetMenuMenuItems :many
SELECT mi.* FROM menu_items AS mi
INNER JOIN menus_menu_items AS mmi
ON mmi.fk_menu_item_id = mi.id
WHERE mmi.fk_menu_id = $1;

-- name: GetMenuMenuItemsByPublicId :many
SELECT mi.* FROM menu_items AS mi
INNER JOIN menus_menu_items AS mmi
ON mmi.fk_menu_item_id = mi.id
INNER JOIN menus AS m
ON m.id = mmi.fk_menu_id
WHERE m.public_id = $1;

-- name: DeleteMenuMenuItems :exec
DELETE FROM menus_menu_items WHERE  fk_menu_id = $1 AND fk_menu_item_id = $2;

-- name: DeleteMenuMenuItemsByMenuItem :exec
DELETE FROM menus_menu_items WHERE fk_menu_item_id = $1;

-- name: DeleteOrdersMenuItem :exec
DELETE FROM orders_menu_items AS omi WHERE omi.fk_menu_item_id = $1;

-- name: DeleteMenuItem :exec
DELETE FROM menu_items WHERE id = $1;

-- name: GetMenuItems :many
SELECT * FROM menu_items ORDER BY created_at DESC;

-- name: AddMenuItemToMenu :exec
INSERT INTO menus_menu_items (fk_menu_id, fk_menu_item_id) VALUES ($1, $2);