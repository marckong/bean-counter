package api

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/ryan-willis/bean-counter/server/db"
)

type MenuItem struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateMenuMenuItemRequest struct {
	MenuItemId string `json:"menu_item_id"`
}

func (a *API) createMenuMenuItem(c *gin.Context) {
	menuId := c.Param("id")
	dbId := &pgtype.UUID{}
	dbId.Scan(menuId)
	_, err := a.db.GetMenu(c.Request.Context(), *dbId)
	if err != nil {
		a.log.Error("Failed to get menu: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}

	var createMenuMenuItemRequest CreateMenuMenuItemRequest
	if err = c.BindJSON(&createMenuMenuItemRequest); err != nil {
		c.JSON(400, gin.H{
			"error": "invalid request",
		})
		return
	}

	var fkMenuItemId pgtype.UUID
	fkMenuItemId.Scan(createMenuMenuItemRequest.MenuItemId)

	err = a.db.AddMenuItemToMenu(c.Request.Context(), db.AddMenuItemToMenuParams{
		FkMenuItemID: fkMenuItemId,
		FkMenuID:     *dbId,
	})

	if err != nil {
		a.log.Error("Failed to add menu item to menu: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}

	c.JSON(201, nil)
}

func (a *API) deleteMenuMenuItem(c *gin.Context) {
	menuId := c.Param("id")
	menuItemId := c.Param("item")
	dbMenuId := &pgtype.UUID{}
	dbMenuId.Scan(menuId)
	dbMenuItemId := &pgtype.UUID{}
	dbMenuItemId.Scan(menuItemId)

	err := a.db.DeleteMenuMenuItems(c.Request.Context(), db.DeleteMenuMenuItemsParams{
		FkMenuID:     *dbMenuId,
		FkMenuItemID: *dbMenuItemId,
	})
	if err != nil {
		a.log.Error("Failed to delete menu menu item: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	c.JSON(204, nil)
}

func (a *API) getMenuMenuItems(c *gin.Context) {
	menuId := c.Param("id")
	dbId := &pgtype.UUID{}
	var pbId pgtype.Text
	err := dbId.Scan(menuId)
	if err != nil {
		pbId = pgtype.Text{String: menuId, Valid: true}
		items, err := a.db.GetMenuMenuItemsByPublicId(c.Request.Context(), pbId)
		if err != nil {
			a.log.Error("Failed to get menu menu items by public id during getMenuMenuItem: " + err.Error())
			c.JSON(500, gin.H{
				"error": "internal server error",
			})
			return
		}
		if items == nil {
			c.JSON(200, []MenuItem{})
			return
		}
		c.JSON(200, items)
	} else {
		_, err = a.db.GetMenu(c.Request.Context(), *dbId)
		if err != nil {
			a.log.Error("Failed to get menu during getMenuMenuItem: " + err.Error())
			c.JSON(404, gin.H{
				"error": "could not find menu",
			})
			return
		}
		items, err := a.db.GetMenuMenuItems(c.Request.Context(), *dbId)
		if err != nil {
			a.log.Error("Failed to get menu menu items during getMenuMenuItem: " + err.Error())
			c.JSON(500, gin.H{
				"error": "internal server error",
			})
			return
		}

		if items == nil {
			c.JSON(200, []MenuItem{})
			return
		}

		c.JSON(200, items)
	}
}

func (a *API) createMenuItem(c *gin.Context) {
	var createMenuItemRequet CreateMenuItemRequest
	if err := c.BindJSON(&createMenuItemRequet); err != nil {
		c.JSON(400, gin.H{
			"error": "invalid request",
		})
		return
	}
	createdMenuItem, err := a.db.CreateMenuItem(c.Request.Context(), createMenuItemRequet.Name)
	if err != nil {
		a.log.Error("Failed to create menu item: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	c.JSON(201, createdMenuItem)
}

func (a *API) getMenuItems(c *gin.Context) {
	menu_items, err := a.db.GetMenuItems(c.Request.Context())
	if err != nil {
		a.log.Error("failed to get menu items during getMenuItems: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
	}
	if menu_items == nil {
		c.JSON(200, []MenuItem{})
		return
	}
	c.JSON(200, menu_items)
}

func (a *API) deleteMenuItem(c *gin.Context) {
	menuItemId := c.Param("id")
	dbId := &pgtype.UUID{}
	dbId.Scan(menuItemId)

	err := a.db.DeleteOrdersMenuItem(c.Request.Context(), *dbId)
	if err != nil {
		a.log.Error("Failed to delete orders menu item: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}

	err = a.db.DeleteMenuMenuItemsByMenuItem(c.Request.Context(), *dbId)

	if err != nil {
		a.log.Error("Failed to delete menu menu items: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}

	err = a.db.DeleteMenuItem(context.Background(), *dbId)
	if err != nil {
		a.log.Error("Failed to delete menu item: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	c.JSON(204, nil)
}
