// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: menus.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createMenu = `-- name: CreateMenu :one
INSERT INTO menus (name, public_id) VALUES ($1, $2) RETURNING id, name, created_at, updated_at, public_id
`

type CreateMenuParams struct {
	Name     string      `json:"name"`
	PublicID pgtype.Text `json:"public_id"`
}

func (q *Queries) CreateMenu(ctx context.Context, arg CreateMenuParams) (Menu, error) {
	row := q.db.QueryRow(ctx, createMenu, arg.Name, arg.PublicID)
	var i Menu
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.PublicID,
	)
	return i, err
}

const deleteMenu = `-- name: DeleteMenu :exec
DELETE FROM menus WHERE id = $1
`

func (q *Queries) DeleteMenu(ctx context.Context, id pgtype.UUID) error {
	_, err := q.db.Exec(ctx, deleteMenu, id)
	return err
}

const deleteMenusMenuItems = `-- name: DeleteMenusMenuItems :exec
DELETE FROM menus_menu_items WHERE fk_menu_id = $1
`

func (q *Queries) DeleteMenusMenuItems(ctx context.Context, fkMenuID pgtype.UUID) error {
	_, err := q.db.Exec(ctx, deleteMenusMenuItems, fkMenuID)
	return err
}

const getMenu = `-- name: GetMenu :one
SELECT id, name, created_at, updated_at, public_id FROM menus WHERE id = $1
`

func (q *Queries) GetMenu(ctx context.Context, id pgtype.UUID) (Menu, error) {
	row := q.db.QueryRow(ctx, getMenu, id)
	var i Menu
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.PublicID,
	)
	return i, err
}

const getMenuByPublicId = `-- name: GetMenuByPublicId :one
SELECT id, name, created_at, updated_at, public_id FROM menus WHERE public_id = $1
`

func (q *Queries) GetMenuByPublicId(ctx context.Context, publicID pgtype.Text) (Menu, error) {
	row := q.db.QueryRow(ctx, getMenuByPublicId, publicID)
	var i Menu
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.PublicID,
	)
	return i, err
}

const getMenus = `-- name: GetMenus :many
SELECT id, name, created_at, updated_at, public_id FROM menus ORDER BY created_at DESC
`

func (q *Queries) GetMenus(ctx context.Context) ([]Menu, error) {
	rows, err := q.db.Query(ctx, getMenus)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Menu
	for rows.Next() {
		var i Menu
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.PublicID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateMenu = `-- name: UpdateMenu :one
UPDATE menus SET name = $1 WHERE id = $2 RETURNING id, name, created_at, updated_at, public_id
`

type UpdateMenuParams struct {
	Name string      `json:"name"`
	ID   pgtype.UUID `json:"id"`
}

func (q *Queries) UpdateMenu(ctx context.Context, arg UpdateMenuParams) (Menu, error) {
	row := q.db.QueryRow(ctx, updateMenu, arg.Name, arg.ID)
	var i Menu
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.PublicID,
	)
	return i, err
}
