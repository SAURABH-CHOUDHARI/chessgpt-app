package main

import (
	"log"

	"chessgpt-app/ai"
	"chessgpt-app/config"
	"chessgpt-app/server"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Gemini client
	aiServer := ai.NewChessServer(cfg.GeminiKey)

	// Init router
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Setup routes
	server.SetupRouter(r, aiServer)

	// Start server
	log.Printf("Server starting on Port :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
