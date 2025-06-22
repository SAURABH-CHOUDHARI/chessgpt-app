// hooks/useTheme.ts
import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setThemeState] = useState<"light" | "dark">("light");

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initial = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
        setThemeState(initial);
        document.documentElement.classList.toggle("dark", initial === "dark");
    }, []);

    const setTheme = (theme: "light" | "dark") => {
        localStorage.setItem("theme", theme);
        setThemeState(theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    };

    return { theme, setTheme };
}
