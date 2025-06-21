package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	GeminiKey string
	Port      string
}

func LoadConfig() *Config {
	// load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found; using real environment variables")
	}

	// read .env
	apiKey := os.Getenv("GEMINI_KEY")
	if apiKey == "" {
		log.Fatal("GEMINI_KEY environment variable is required")
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		GeminiKey: apiKey,
		Port:      port,
	}
}
