package api

import (
	"context"
	"log/slog"
	"os"
	"strings"
	"time"

	"github.com/dusted-go/logging/prettylog"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/ryan-willis/bean-counter/server/db"
)

type API struct {
	log           *slog.Logger
	db            *db.Queries
	dbPool        *pgxpool.Pool
	adminPassword string
}

func NewAPI() *API {
	_, isProduction := os.LookupEnv("IS_PROD")
	var log *slog.Logger
	if isProduction {
		log = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level:       slog.LevelInfo,
			AddSource:   false,
			ReplaceAttr: nil,
		}))
	} else {
		log = slog.New(prettylog.NewHandler(&slog.HandlerOptions{
			Level:       slog.LevelDebug,
			AddSource:   false,
			ReplaceAttr: nil,
		}))
	}
	log.Info("Connecting to database...")
	pgHost, hasPgHostEnv := os.LookupEnv("PG_HOST")
	if !hasPgHostEnv {
		pgHost = "localhost"
	}
	dbPool, err := pgxpool.New(context.Background(), "postgres://bean:counter@"+pgHost+":5432/beancounter")
	pingCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err != nil || dbPool.Ping(pingCtx) != nil {
		if err != nil {
			log.Error("Failed to connect to database: " + err.Error())
		} else {
			log.Error("Failed to connect to database at " + pgHost + ": ping failed")
		}
		os.Exit(1)
	}
	log.Info("Database connected.")
	internalDb := db.New(dbPool)
	if err := internalDb.Migrate(stdlib.OpenDBFromPool(dbPool)); err != nil {
		log.Error("Failed to migrate database: " + err.Error())
		os.Exit(1)
	}

	return &API{
		log:           log,
		db:            internalDb,
		dbPool:        dbPool,
		adminPassword: os.Getenv("ADMIN_PASSWORD"),
	}
}

func (a *API) Serve() {
	a.log.Info("Server starting...")
	gin.SetMode(gin.ReleaseMode)
	server := gin.New()
	server.Use(gin.Recovery())
	server.Use(static.Serve("/", static.LocalFile("./dist", true)))
	server.NoRoute(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.RequestURI, "/api") {
			c.File("./dist/index.html")
		}
	})

	apiRouter := server.Group("/api")

	apiRouter.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	apiRouter.GET("/menus", a.adminRoute, a.getMenus)
	apiRouter.POST("/menus", a.adminRoute, a.createMenu)
	apiRouter.PUT("/menus/:id", a.adminRoute, a.updateMenu)
	apiRouter.DELETE("/menus/:id", a.adminRoute, a.deleteMenu)
	apiRouter.POST("/menus/:id/items", a.adminRoute, a.createMenuMenuItem)
	apiRouter.DELETE("/menus/:id/items/:item", a.adminRoute, a.deleteMenuMenuItem)

	apiRouter.GET("/menu-items", a.adminRoute, a.getMenuItems)
	apiRouter.POST("/menu-items", a.adminRoute, a.createMenuItem)
	apiRouter.DELETE("/menu-items/:id", a.adminRoute, a.deleteMenuItem)

	apiRouter.GET("/orders", a.adminRoute, a.getOrders)
	apiRouter.PUT("/orders/:id", a.adminRoute, a.updateOrder)

	apiRouter.GET("/menus/:id", a.getMenu)
	apiRouter.GET("/menus/:id/items", a.getMenuMenuItems)
	apiRouter.POST("/menus/:id/orders", a.createOrder)
	apiRouter.GET("/menus/:id/orders/:order/items", a.getOrderItems)
	apiRouter.GET("/orders/:id", a.getOrder)
	apiRouter.GET("/ordersearch/:search", a.searchOrders)

	apiRouter.POST("/auth", a.auth)

	port, portSet := os.LookupEnv("PORT")

	if !portSet {
		port = "8080"
	}

	a.log.Info("Listening on port " + port)
	if err := server.Run(":" + port); err != nil {
		panic(err)
	}
}

func (a *API) adminRoute(c *gin.Context) {
	adminToken, err := c.Cookie("admin-token")

	if err != nil {
		c.JSON(401, gin.H{
			"error": "unauthorized",
		})
		c.Abort()
		return
	}
	_, err = a.db.GetAdminToken(c.Request.Context(), adminToken)
	if err != nil {
		c.JSON(401, gin.H{
			"error": "unauthorized",
		})
		c.Abort()
		return
	}

}
