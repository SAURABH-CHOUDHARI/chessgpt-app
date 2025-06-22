import { Chessboard } from "react-chessboard";
import { useGameStore } from "@/store/useGameStore";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import chessAPI from "@/services/api";
import { Loading } from "@/components/ui/loading";

export default function ChessBoard() {
    const [game, setGame] = useState(new Chess());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fen = useGameStore((s) => s.fen);
    const setFen = useGameStore((s) => s.setFen);
    const history = useGameStore((s) => s.history);
    const setHistory = useGameStore((s) => s.setHistory);
    const difficulty = useGameStore((s) => s.difficulty);
    const setMovePending = useGameStore((s) => s.setMovePending);
    const currentTurn = useGameStore((s) => s.currentTurn);
    const setCurrentTurn = useGameStore((s) => s.setCurrentTurn);
    const setResult = useGameStore((s) => s.setResult);

    // Initialize game when component mounts
    useEffect(() => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setHistory([]);
        setCurrentTurn("white");
        setResult(undefined);
        setError(null);
    }, []);

    // Update game state when FEN changes
    useEffect(() => {
        if (fen && fen !== game.fen()) {
            const newGame = new Chess(fen);
            setGame(newGame);
        }
    }, [fen]);

    const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
        // Don't allow moves if it's not player's turn or if AI is thinking
        if (currentTurn !== "white" || isLoading) {
            return false;
        }

        // Try to make the move
        const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
        if (!move) return false;

        // Check for game end conditions
        if (game.isGameOver()) {
            handleGameEnd();
            return true;
        }

        // Update local game state
        const newFen = game.fen();
        const updatedHistory = [...history, move.san];
        setFen(newFen);
        setHistory(updatedHistory);
        setCurrentTurn("black");
        setMovePending(true);
        setError(null);

        // Get AI move asynchronously
        getAIMove(newFen, updatedHistory);

        return true;
    };

    const getAIMove = async (newFen: string, updatedHistory: string[]) => {
        try {
            setIsLoading(true);
            const response = await chessAPI.getAIMove({
                fen: newFen,
                history: updatedHistory,
                difficulty: difficulty
            });

            const aiMove = response.move;
            if (!aiMove) {
                throw new Error("No AI move received");
            }

            // Apply AI move
            const aiMoveApplied = game.move(aiMove);
            if (!aiMoveApplied) {
                throw new Error("Invalid AI move received");
            }

            // Update game state after AI move
            const finalFen = game.fen();
            const finalHistory = [...updatedHistory, aiMove];
            setFen(finalFen);
            setHistory(finalHistory);
            setCurrentTurn("white");
            setMovePending(false);

            // Check for game end after AI move
            if (game.isGameOver()) {
                handleGameEnd();
            }

        } catch (err) {
            console.error("AI move failed:", err);
            setError(err instanceof Error ? err.message : "Failed to get AI move");
            setMovePending(false);
            setCurrentTurn("white"); // Reset turn to allow retry
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameEnd = () => {
        setMovePending(false);
        if (game.isCheckmate()) {
            setResult(currentTurn === "white" ? "black" : "white");
        } else if (game.isDraw()) {
            setResult("draw");
        } else if (game.isStalemate()) {
            setResult("draw");
        }
    };

    const getGameStatus = () => {
        if (game.isCheckmate()) {
            return `Checkmate! ${currentTurn === "white" ? "Black" : "White"} wins!`;
        }
        if (game.isDraw()) {
            return "Game is a draw!";
        }
        if (game.isStalemate()) {
            return "Stalemate!";
        }
        if (game.isCheck()) {
            return `${currentTurn === "white" ? "White" : "Black"} is in check!`;
        }
        return `${currentTurn === "white" ? "White" : "Black"}'s turn`;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted rounded-lg p-1 lg:p-2">
            {/* Game Status - Compact on mobile */}
            <div className="mb-1 lg:mb-2 text-center">
                <div className="text-xs lg:text-sm font-semibold mb-1">{getGameStatus()}</div>
                {isLoading && (
                    <Loading message="AI thinking..." size="sm" />
                )}
                {error && (
                    <div className="text-xs text-red-500">
                        Error: {error}
                    </div>
                )}
            </div>

            {/* Chess Board - Maximize size but stay within bounds */}
            <div className="aspect-square w-full max-w-[400px] lg:max-w-[80vh] lg:max-h-[80vh]">
                <Chessboard 
                    position={fen} 
                    onPieceDrop={onDrop}
                    boardOrientation="white"
                    areArrowsAllowed={true}
                    arePiecesDraggable={currentTurn === "white" && !isLoading}
                />
            </div>
        </div>
    );
}
