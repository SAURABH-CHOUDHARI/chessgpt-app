import DifficultySelector from "./panel/DifficultySelector";
import GameControls from "./panel/GameControls";
import MoveHistory from "./panel/MoveHistory";
import TurnIndicator from "./panel/TurnIndicator";

export default function ControlPanel() {
    return (
        <div className="p-1 lg:p-2 flex flex-col gap-2 lg:gap-3 h-full overflow-y-auto">
            <TurnIndicator />
            <DifficultySelector />
            <GameControls />
            {/* Show move history on mobile, hidden on desktop (shown in chess board) */}
            <div className="lg:hidden">
                <MoveHistory />
            </div>
        </div>
    );
}
