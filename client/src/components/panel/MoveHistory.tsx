import { useGameStore } from "@/store/useGameStore";

export default function MoveHistory() {
    const history = useGameStore((s) => s.history);

    const formatMoves = () => {
        const moves = [];
        for (let i = 0; i < history.length; i += 2) {
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = history[i];
            const blackMove = history[i + 1];
            
            moves.push({
                number: moveNumber,
                white: whiteMove,
                black: blackMove
            });
        }
        return moves;
    };

    const moves = formatMoves();

    return (
        <div>
            <h2 className="text-xs font-semibold mb-1">Move History</h2>
            <div className="text-xs max-h-24 lg:max-h-32 overflow-auto border rounded p-1 bg-muted/20">
                {moves.length === 0 ? (
                    <div className="text-muted-foreground text-center py-2">
                        No moves yet
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {moves.map((move) => (
                            <div key={move.number} className="flex items-center gap-1">
                                <span className="text-muted-foreground min-w-[1.5rem]">
                                    {move.number}.
                                </span>
                                <span className="min-w-[2rem]">{move.white}</span>
                                {move.black && (
                                    <span className="min-w-[2rem]">{move.black}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
