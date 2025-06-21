package models

type MoveRequest struct {
	FEN        string   `json:"fen" binding:"required"`
	History    []string `json:"history" binding:"required"`
	Difficulty string   `json:"difficulty,omitempty"`
}

type MoveResponse struct {
	Move  string `json:"move"`
	Error string `json:"error,omitempty"`
}
