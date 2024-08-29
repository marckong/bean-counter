package api

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/ryan-willis/bean-counter/server/db"
	"github.com/teris-io/shortid"
)

type Menu struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateMenuRequest struct {
	Name string `json:"name"`
}

func (a *API) createMenu(c *gin.Context) {
	var createMenuRequest CreateMenuRequest
	if err := c.BindJSON(&createMenuRequest); err != nil {
		c.JSON(400, gin.H{
			"error": "invalid request",
		})
		return
	}
	public, _ := shortid.Generate()
	createdMenu, err := a.db.CreateMenu(context.Background(), db.CreateMenuParams{
		Name:     createMenuRequest.Name,
		PublicID: pgtype.Text{String: public, Valid: true},
	})
	if err != nil {
		a.log.Error("Failed to create menu: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	c.JSON(201, createdMenu)
}

func (a *API) getMenu(c *gin.Context) {
	menuId := c.Param("id")
	dbId := &pgtype.UUID{}
	var pbId pgtype.Text
	err := dbId.Scan(menuId)
	if err != nil {
		pbId = pgtype.Text{String: menuId, Valid: true}
		menu, err := a.db.GetMenuByPublicId(context.Background(), pbId)
		if err != nil {
			a.log.Error("Failed to get menu by public id: " + err.Error())
			c.JSON(500, gin.H{
				"error": "internal server error",
			})
			return
		}
		c.JSON(200, menu)
		return
	}
	menu, err := a.db.GetMenu(context.Background(), *dbId)
	if err != nil {
		a.log.Error("Failed to get menu directly: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	c.JSON(200, menu)
}

func (a *API) updateMenu(c *gin.Context) {
	var updateMenuRequest CreateMenuRequest
	if err := c.BindJSON(&updateMenuRequest); err != nil {
		c.JSON(400, gin.H{
			"error": "invalid request",
		})
		return
	}
	menuId := c.Param("id")
	dbId := &pgtype.UUID{}
	dbId.Scan(menuId)
	updatedMenu, err := a.db.UpdateMenu(context.Background(), db.UpdateMenuParams{
		Name: updateMenuRequest.Name,
		ID:   *dbId,
	})

	if err != nil {
		a.log.Error("Failed to update menu: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	c.JSON(200, updatedMenu)
}

func (a *API) deleteMenu(c *gin.Context) {
	menuId := c.Param("id")
	dbId := &pgtype.UUID{}
	dbId.Scan(menuId)
	tx, err := a.dbPool.Begin(context.Background())
	if err != nil {
		a.log.Error("Failed to start transaction: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	defer tx.Rollback(context.Background())

	qtx := a.db.WithTx(tx)

	orders, _ := qtx.GetOrdersByMenuID(context.Background(), *dbId)

	for _, order := range orders {
		qtx.DeleteItemsFromOrder(context.Background(), order.ID)
		qtx.DeleteOrder(context.Background(), order.ID)
	}

	err = qtx.DeleteMenusMenuItems(context.Background(), *dbId)
	if err != nil {
		a.log.Error("Failed to delete menu items: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}

	err = qtx.DeleteMenu(context.Background(), *dbId)
	if err != nil {
		a.log.Error("Failed to delete menu: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	tx.Commit(context.Background())
	c.JSON(204, nil)
}

type CreateMenuItemRequest struct {
	Name string `json:"name"`
}

func (a *API) getMenus(c *gin.Context) {
	menus, err := a.db.GetMenus(context.Background())
	if err != nil {
		a.log.Error("Failed to get menu during getMenus: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	if menus == nil {
		c.JSON(200, []db.Menu{})
		return
	}
	c.JSON(200, menus)
}
