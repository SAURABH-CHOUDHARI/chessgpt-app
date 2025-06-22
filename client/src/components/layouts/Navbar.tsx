import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg">
                            <span className="text-primary-foreground font-bold text-sm lg:text-base">♔</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <h1 className="text-lg lg:text-xl font-bold tracking-tight">ChessGPT</h1>
                            <span className="text-xs lg:text-sm text-muted-foreground hidden sm:inline">
                                AI Chess Game
                            </span>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        className="h-9 w-9 lg:h-10 lg:w-10 rounded-lg hover:bg-muted"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4 lg:h-5 lg:w-5 transition-transform hover:rotate-90" />
                        ) : (
                            <Moon className="h-4 w-4 lg:h-5 lg:w-5 transition-transform hover:rotate-12" />
                        )}
                    </Button>
                </div>
            </div>
        </nav>
    );
}
