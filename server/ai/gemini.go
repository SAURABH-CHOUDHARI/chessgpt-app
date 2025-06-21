package ai

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type ChessServer struct {
	client *genai.Client
	model  *genai.GenerativeModel
}

func NewChessServer(apiKey string) *ChessServer {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Fatalf("Failed to create Gemini client: %v", err)
	}

	model := client.GenerativeModel("gemini-2.0-flash-exp")
	return &ChessServer{client: client, model: model}
}

func (s *ChessServer) GetAIMove(parentCtx context.Context, fen string, history []string, legalMoves []string, difficulty string) (string, error) {
	if difficulty == "" {
		difficulty = "intermediate"
	}

	var systemPrompt string
	switch strings.ToLower(difficulty) {
	case "easy":
		systemPrompt = `You are a beginner chess player. You should:
		- Make reasonable but not optimal moves
		- Sometimes prioritize piece activity over perfect development
		- Occasionally make moves that look natural but aren't the strongest
		- Consider simple developing moves, pawn pushes, or early piece activity
		- Avoid the most sophisticated theoretical moves
		- Play intuitively rather than following perfect opening theory
		- Choose from multiple decent options rather than always the single best move`

	case "medium", "intermediate":
		systemPrompt = `You are an intermediate chess player. You should:
		- Make generally good moves but not always the best
		- Understand basic opening principles but make some inaccuracies
		- Occasionally miss simple tactics
		- Prefer solid, straightforward play
		- Sometimes play too defensively or too aggressively`

	case "hard":
		systemPrompt = `You are an advanced chess player. You should:
		- Make strong, principled moves most of the time
		- Understand opening theory well
		- Calculate tactics accurately
		- Occasionally make subtle inaccuracies
		- Play with good strategic understanding`

	case "expert":
		systemPrompt = `You are a chess expert. You should:
		- Always choose the objectively best or near-best moves
		- Follow optimal opening theory
		- Calculate deeply and accurately
		- Make moves that create maximum problems for the opponent
		- Play with perfect understanding of chess principles`

	default:
		systemPrompt = `You are an intermediate chess player making reasonable moves.`
	}

	systemPrompt += `

You will receive:
1) The current board position in FEN
2) The move history in SAN notation
3) A complete list of legal moves in SAN

Respond with EXACTLY one move in SAN notation. It MUST be one of the legal moves provided.
Do not output anything else - no commentary, no punctuation, just the move.`

	userPrompt := fmt.Sprintf(
		"Current position (FEN): %s\nMove history: %s\nLegal moves in SAN: %s\nWhich move do you choose?",
		fen,
		strings.Join(history, " "),
		strings.Join(legalMoves, ", "),
	)

	ctx, cancel := context.WithTimeout(parentCtx, 10*time.Second)
	defer cancel()

	resp, err := s.model.GenerateContent(ctx, genai.Text(systemPrompt+"\n\n"+userPrompt))
	if err != nil {
		return "", fmt.Errorf("gemini API error: %v", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no responses from Gemini")
	}

	part := resp.Candidates[0].Content.Parts[0]

	// Try different ways to extract text
	var move string
	switch p := part.(type) {
	case *genai.Text:
		move = strings.TrimSpace(string(*p))
	case genai.Text:
		move = strings.TrimSpace(string(p))
	default:
		// Try to get string representation
		move = strings.TrimSpace(fmt.Sprintf("%v", p))
	}

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
