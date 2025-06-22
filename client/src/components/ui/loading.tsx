import { Loader2 } from "lucide-react";

interface LoadingProps {
    message?: string;
    size?: "sm" | "md" | "lg";
}

export function Loading({ message = "Loading...", size = "md" }: LoadingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <Loader2 className={`${sizeClasses[size]} animate-spin`} />
            <span className="text-sm text-muted-foreground">{message}</span>
        </div>
    );
} 