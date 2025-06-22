import { useGameStore } from "@/store/useGameStore";

export default function TurnIndicator() {
    const turn = useGameStore((s) => s.currentTurn);
    const movePending = useGameStore((s) => s.movePending);
    const result = useGameStore((s) => s.result);
    const difficulty = useGameStore((s) => s.difficulty);

    if (result) {
        return (
            <div className="text-center p-1 lg:p-2 bg-muted rounded">
                <div className="text-sm lg:text-base font-bold mb-1">
                    {result === "draw" ? "Game Draw!" : `${result.charAt(0).toUpperCase() + result.slice(1)} Wins!`}
                </div>
                <div className="text-xs text-muted-foreground">
                    Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </div>
            </div>
        );
    }

    return (
        <div className="text-center p-1 lg:p-2 bg-muted rounded">
            <div className="text-sm lg:text-base font-bold mb-1">
                {movePending ? "AI Thinking..." : `${turn.charAt(0).toUpperCase() + turn.slice(1)}'s Turn`}
            </div>
            <div className="text-xs text-muted-foreground">
                Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </div>
            {movePending && (
                <div className="mt-1">
                    <div className="animate-pulse bg-primary/20 h-1 rounded-full"></div>
                </div>
            )}
        </div>
    );
}
