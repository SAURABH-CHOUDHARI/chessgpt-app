package chess

import (
	"fmt"

	"github.com/corentings/chess/v2"
)

func ValidateFENAndGetMoves(fen string) ([]string, error) {
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
