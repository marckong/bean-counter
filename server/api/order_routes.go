package api

import (
	"context"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/ryan-willis/bean-counter/server/db"
)

type CreateOrderRequest struct {
	Name   string `json:"name"`
	ItemID string `json:"item"`
}

func (a *API) createOrder(c *gin.Context) {
	mid := c.Param("id")
	menuID := &pgtype.UUID{}
	err := menuID.Scan(mid)
	if err != nil {
		menu, err := a.db.GetMenuByPublicId(context.Background(), pgtype.Text{String: mid, Valid: true})
		if err != nil {
			a.log.Error("Failed to get menu: " + err.Error())
			c.JSON(500, gin.H{
				"error": "internal server error",
			})
			return
		}
		menuID = &menu.ID
	}
	var orderRequest CreateOrderRequest
	if err := c.BindJSON(&orderRequest); err != nil {
		a.log.Error("Failed to bind order: " + err.Error())
		c.JSON(400, gin.H{
			"error": "bad request",
		})
		return
	}
	createdOrder, err := a.db.CreateOrder(context.Background(), db.CreateOrderParams{
		MenuID:       *menuID,
		CustomerName: orderRequest.Name,
	})
	if err != nil {
		a.log.Error("Failed to create order: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}

	itemID := pgtype.UUID{}
	itemID.Scan(orderRequest.ItemID)

	err = a.db.AddItemToOrder(context.Background(), db.AddItemToOrderParams{
		FkOrderID:    createdOrder.ID,
		FkMenuItemID: itemID,
	})

	if err != nil {
		a.log.Error("Failed to add item to order: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}

	c.JSON(201, createdOrder)
}

type OrderItem struct {
	Name string `json:"name"`
}

func (a *API) getOrderItems(c *gin.Context) {
	oid := c.Param("order")
	orderID := &pgtype.UUID{}
	err := orderID.Scan(oid)
	if err != nil {
		a.log.Error("Failed to get order: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	items, err := a.db.GetOrderItems(context.Background(), *orderID)
	if err != nil {
		a.log.Error("Failed to get order items: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	if len(items) == 0 {
		c.JSON(404, gin.H{
			"error": "not found",
		})
		return
	}
	apiItems := make([]OrderItem, len(items))

	for i, item := range items {
		apiItems[i] = OrderItem{Name: item}
	}

	c.JSON(200, gin.H{
		"items": apiItems,
	})
}

func (a *API) getOrders(c *gin.Context) {
	dbOrdersItems, err := a.db.GetOrdersItems(c.Request.Context())

	if err != nil {
		a.log.Error("Failed to get orders: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}

	c.JSON(200, dbOrdersItems)
}

func (a *API) updateOrder(c *gin.Context) {
	oid := c.Param("id")
	orderID := &pgtype.UUID{}
	err := orderID.Scan(oid)
	if err != nil {
		a.log.Error("Failed to get order: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	var order db.Order
	if err := c.BindJSON(&order); err != nil {
		a.log.Error("Failed to bind order: " + err.Error())
		c.JSON(400, gin.H{
			"error": "bad request",
		})
		return
	}
	order.ID = *orderID
	_, err = a.db.UpdateOrder(c.Request.Context(), db.UpdateOrderParams{
		ID:     order.ID,
		Status: order.Status,
	})
	if err != nil {
		a.log.Error("Failed to update order: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	c.JSON(200, gin.H{
		"status": "ok",
	})
}

type GetOrderResult struct {
	Order db.Order `json:"order"`
	Items []string `json:"items"`
}

func (a *API) getOrder(c *gin.Context) {
	oid := c.Param("id")
	orderID := &pgtype.UUID{}
	err := orderID.Scan(oid)
	if err != nil {
		a.log.Error("Failed to get order: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	var wg sync.WaitGroup
	errs := make(chan error, 2)
	getOrderResult := make(chan db.Order, 1)
	getOrderItemsResult := make(chan []string, 1)

	wg.Add(2)

	go func(_wg *sync.WaitGroup) {
		defer _wg.Done()
		order, err := a.db.GetOrder(c.Request.Context(), *orderID)
		if err != nil {
			errs <- err
			return
		}
		getOrderResult <- order
	}(&wg)

	go func(_wg *sync.WaitGroup) {
		defer wg.Done()
		items, err := a.db.GetOrderItems(c.Request.Context(), *orderID)
		if err != nil {
			errs <- err
			return
		}
		getOrderItemsResult <- items
	}(&wg)

	wg.Wait()
	close(errs)
	close(getOrderResult)
	close(getOrderItemsResult)

	if len(errs) > 0 {
		for err := range errs {
			if err != nil {
				a.log.Error("Failed to get order: " + err.Error())
				c.JSON(500, gin.H{
					"error": "internal server error",
				})
				return
			}
		}
	}

	c.JSON(200, GetOrderResult{
		Order: <-getOrderResult,
		Items: <-getOrderItemsResult,
	})
}

func (a *API) searchOrders(c *gin.Context) {
	search := c.Param("search")
	orders, err := a.db.FindOrder(context.Background(), "%"+strings.ToLower(search)+"%")
	if err != nil {
		a.log.Error("Failed to search orders: " + err.Error())
		c.JSON(500, gin.H{
			"error": "internal server error",
		})
		return
	}
	c.JSON(200, orders)
}
