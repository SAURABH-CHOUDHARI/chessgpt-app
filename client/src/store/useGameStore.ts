import { create } from "zustand";

type GameState = {
    fen: string;
    history: string[];
    currentTurn: "white" | "black";
    difficulty: "easy" | "medium" | "intermediate" | "hard" | "expert";
    movePending: boolean;
    result?: "white" | "black" | "draw";

    setFen: (fen: string) => void;
    setHistory: (history: string[]) => void;
    setCurrentTurn: (turn: "white" | "black") => void;
    setDifficulty: (d: GameState["difficulty"]) => void;
    setMovePending: (pending: boolean) => void;
    setResult: (result?: "white" | "black" | "draw") => void;
    startGame: () => void;
    makeMove: (move: string) => void;
    setFromAPI: (data: { fen: string; history: string[] }) => void;
    resetGame: () => void;
};

export const useGameStore = create<GameState>((set) => ({
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    history: [],
    currentTurn: "white",
    difficulty: "intermediate",
    movePending: false,
    result: undefined,

    setFen: (fen) => set({ fen }),
    setHistory: (history) => set({ history }),
    setCurrentTurn: (currentTurn) => set({ currentTurn }),
    setDifficulty: (d) => set({ difficulty: d }),
    setMovePending: (movePending) => set({ movePending }),
    setResult: (result) => set({ result }),

    startGame: () =>
        set({
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            history: [],
            currentTurn: "white",
            movePending: false,
            result: undefined,
        }),

    makeMove: (move) =>
        set((state) => ({
            history: [...state.history, move],
            currentTurn: state.currentTurn === "white" ? "black" : "white",
        })),

    setFromAPI: ({ fen, history }) =>
        set({
            fen,
            history,
        }),

    resetGame: () =>
        set({
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            history: [],
            currentTurn: "white",
            movePending: false,
            result: undefined,
        }),
}));
