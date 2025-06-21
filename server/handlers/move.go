package handlers

import (
	"log"

	"chessgpt-app/ai"
	"chessgpt-app/chess"
	"chessgpt-app/models"

	"github.com/gin-gonic/gin"
)

type MoveHandler struct {
	aiServer *ai.ChessServer
}

func NewMoveHandler(aiServer *ai.ChessServer) *MoveHandler {
	return &MoveHandler{aiServer: aiServer}
}

func (h *MoveHandler) HandleMove(c *gin.Context) {
	var req models.MoveRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, models.MoveResponse{Error: "Invalid request body"})
		return
	}
	log.Printf("[handleMove] Request: FEN=%s, History=%v, Difficulty=%q",
		req.FEN, req.History, req.Difficulty,
	)

	legalSAN, err := chess.ValidateFENAndGetMoves(req.FEN)
	if err != nil {
		log.Printf("[handleMove] Chess validation error: %v", err)
		c.JSON(400, models.MoveResponse{Error: err.Error()})
		return
	}

	move, err := h.aiServer.GetAIMove(c.Request.Context(), req.FEN, req.History, legalSAN, req.Difficulty)
	if err != nil {
		log.Printf("[handleMove] AI move error: %v", err)
		c.JSON(400, models.MoveResponse{Error: err.Error()})
		return
	}

	log.Printf("[handleMove] AI chose: %q", move)
	c.JSON(200, models.MoveResponse{Move: move})
}

func HandleHealth(c *gin.Context) {
	c.String(200, "ChessGPT Server is Running")
}
