package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/corentings/chess/v2"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

type MoveRequest struct {
	FEN        string   `json:"fen" binding:"required"`
	History    []string `json:"history" binding:"required"`
	Difficulty string   `json:"difficulty,omitempty"`
}

type MoveResponse struct {
	Move  string `json:"move"`
	Error string `json:"error,omitempty"`
}

type ChessServer struct {
	client openai.Client
}

func NewChessServer(apiKey string) *ChessServer {
	client := openai.NewClient(option.WithAPIKey(apiKey))
	return &ChessServer{client: client}
}

func validateFENAndGetMoves(fen string) ([]string, error) {
	fenOpt, err := chess.FEN(fen)
	if err != nil {
		return nil, fmt.Errorf("invalid FEN: %v", err)
	}
	game := chess.NewGame(fenOpt)
	legal := game.ValidMoves()
	if len(legal) == 0 {
		return nil, fmt.Errorf("no legal moves available")
	}

	notation := chess.AlgebraicNotation{}
	legalSAN := make([]string, len(legal))

	for i, mv := range legal {
		legalSAN[i] = notation.Encode(game.Position(), &mv)
	}
	return legalSAN, nil
}

func (s *ChessServer) getAIMove(parentCtx context.Context, fen string, history []string, legalMoves []string, difficulty string) (string, error) {
	if difficulty == "" {
		difficulty = "intermediate"
	}

	systemPrompt := fmt.Sprintf(
		`You are a chess AI playing at %s level.
		You will receive:
		1) the current board position in  FEN,
		2) the move history (SAN),
		3) a comeplete list of legal moves in SAN. 
		
		Respond with EXACTLY one move in SAN, and it MUST be one of those legal moves.
		Do no output anything else (no commnentry, no punctuation , beyond the move).`,
		difficulty,
	)
	userPrompt := fmt.Sprintf(
		"Current position (FEN): %s\nMove history: %s\nLegal moves in SAN: %s\nWhich move do you choose?",
		fen,
		strings.Join(history, " "),
		strings.Join(legalMoves, ", "),
	)

	ctx, cancel := context.WithTimeout(parentCtx, 10*time.Second)
	defer cancel()

	completion, err := s.client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Model: openai.ChatModelO3Mini,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(systemPrompt),
			openai.UserMessage(userPrompt),
		},
		Temperature: openai.Float(0.7),
		MaxTokens:   openai.Int(5),
	})
	if err != nil {
		return "", fmt.Errorf("OpenAI API error: %v", err)
	}
	if len(completion.Choices) == 0 {
		return "", fmt.Errorf("no responses from OpenAI")
	}

	move := strings.TrimSpace(completion.Choices[0].Message.Content)

	// Validate the move is legal
	for _, mv := range legalMoves {
		if mv == move {
			return move, nil
		}
	}

	return "", fmt.Errorf(
		"AI returned illegal move %q (legal moves: %s)",
		move,
		strings.Join(legalMoves, ", "),
	)
}

func (s *ChessServer) handleMove(c *gin.Context) {
	var req MoveRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, MoveResponse{Error: "Invalid request body"})
		return
	}
	log.Printf("[handleMove] Request: FEN=%s, History=%v, Difficulty=%q",
		req.FEN, req.History, req.Difficulty,
	)

	legalSAN, err := validateFENAndGetMoves(req.FEN)
	if err != nil {
		log.Printf("[handleMove] Chess validation error: %v", err)
		c.JSON(400, MoveResponse{Error: err.Error()})
		return
	}

	move, err := s.getAIMove(c.Request.Context(), req.FEN, req.History, legalSAN, req.Difficulty)
	if err != nil {
		log.Printf("[handleMove] AI move error: %v", err)
		c.JSON(400, MoveResponse{Error: err.Error()})
		return
	}

	log.Printf("[handleMove] AI chose: %q", move)
	c.JSON(200, MoveResponse{Move: move})
}

func handleHealth(c *gin.Context) {
	c.String(200, "ChessGPT Server is Running")
}

func main() {
	// load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found; using real environment variables")
	}

	// read .env
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		log.Fatal("OPENAI_API_KEY environment variable is required")
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// OpenAI client
	server := NewChessServer(apiKey)

	// Init router
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Cors
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"POST", "OPTIONS"},
		AllowHeaders: []string{"Content-Type"},
	}))

	// Routes
	r.GET("/health", handleHealth)
	r.POST("/api/move", server.handleMove)
	r.OPTIONS("/api/move", func(c *gin.Context) {
		c.Status(200)
	})

	log.Printf("Server starting on Port :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}