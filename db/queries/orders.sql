-- name: CreateOrder :one
INSERT INTO orders (menu_id, customer_name) VALUES ($1, $2) RETURNING *;

-- name: AddItemToOrder :exec
INSERT INTO orders_menu_items (fk_order_id, fk_menu_item_id) VALUES ($1, $2);

-- name: DeleteItemsFromOrder :exec
DELETE FROM orders_menu_items WHERE fk_order_id = $1;

-- name: DeleteOrder :exec
DELETE FROM orders WHERE id = $1;

-- name: GetOrdersByMenuID :many
SELECT * FROM orders WHERE menu_id = $1;

-- name: GetOrderItems :many
SELECT mi.name
FROM orders AS o
INNER JOIN orders_menu_items AS omi ON omi.fk_order_id = o.id
INNER JOIN menu_items AS mi ON mi.id = omi.fk_menu_item_id
WHERE o.id = $1;

-- name: GetOrders :many
SELECT * FROM orders ORDER BY created_at ASC;

-- name: GetOrdersItems :many
SELECT o.customer_name, o.id as order_id, mi.name as item_name, mi.id as item_id, o.status as order_status
FROM orders AS o
INNER JOIN orders_menu_items AS omi ON omi.fk_order_id = o.id
INNER JOIN menu_items AS mi ON mi.id = omi.fk_menu_item_id
ORDER BY o.created_at ASC;

-- name: UpdateOrder :one
UPDATE orders SET status = $2 WHERE id = $1 RETURNING *;

-- name: GetOrder :one
SELECT * FROM orders WHERE id = $1;

-- name: FindOrder :many
SELECT * FROM orders WHERE LOWER(customer_name) LIKE $1 ORDER BY created_at ASC;
