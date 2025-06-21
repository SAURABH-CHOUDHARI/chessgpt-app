package server

import (
	"chessgpt-app/ai"
	"chessgpt-app/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(r *gin.Engine, aiServer *ai.ChessServer) {
	// Cors
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"POST", "OPTIONS"},
		AllowHeaders: []string{"Content-Type"},
	}))

	// Create handlers
	moveHandler := handlers.NewMoveHandler(aiServer)

	// Routes
	r.GET("/health", handlers.HandleHealth)
	r.POST("/api/move", moveHandler.HandleMove)
	r.OPTIONS("/api/move", func(c *gin.Context) {
		c.Status(200)
	})
}
