import { useGameStore } from "@/store/useGameStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DifficultySelector() {
    const difficulty = useGameStore((s) => s.difficulty);
    const setDifficulty = useGameStore((s) => s.setDifficulty);

    return (
        <div>
            <label className="block mb-1 text-xs lg:text-sm font-semibold">Difficulty</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                    {["easy", "medium", "intermediate", "hard", "expert"].map((d) => (
                        <SelectItem key={d} value={d}>
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
