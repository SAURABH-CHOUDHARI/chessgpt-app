import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/useGameStore";

export default function GameControls() {
    const resetGame = useGameStore((s) => s.resetGame);
    const result = useGameStore((s) => s.result);
    const movePending = useGameStore((s) => s.movePending);

    const handleNewGame = () => {
        resetGame();
    };

    return (
        <div className="flex flex-col gap-2">
            <Button 
                onClick={handleNewGame} 
                disabled={movePending}
                className="w-full text-sm"
            >
                {result ? "New Game" : "Reset Game"}
            </Button>
            
            {result && (
                <div className="text-center p-2 bg-muted rounded">
                    <div className="text-xs lg:text-sm font-semibold">
                        {result === "draw" ? "Game ended in a draw!" : `${result.charAt(0).toUpperCase() + result.slice(1)} wins!`}
                    </div>
                </div>
            )}
        </div>
    );
}
