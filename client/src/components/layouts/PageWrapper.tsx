import  React  from "react";

interface PageWrapperProps {
    children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {children}
        </div>
    );
}
