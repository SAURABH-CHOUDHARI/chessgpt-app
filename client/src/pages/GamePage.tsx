import ChessBoard from "@/components/ChessBoard"
import ControlPanel from "@/components/Controlpanel"
import Navbar from "@/components/layouts/Navbar"
import PageWrapper from "@/components/layouts/PageWrapper"

const GamePage = () => {
    return (
        <PageWrapper>
            <Navbar />  

            <main className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-4rem)]">
                {/* Chess Board Section - Takes more space */}
                <section className="w-full lg:w-[75%] flex items-center justify-center bg-muted p-1 lg:p-2">
                    <ChessBoard />
                </section>

                {/* Control Panel Section - Smaller on desktop */}
                <aside className="w-full lg:w-[25%] p-2 lg:p-3 border-t lg:border-l border-border bg-background overflow-y-auto max-h-[35vh] lg:max-h-none">
                    <ControlPanel />
                </aside>
            </main>
        </PageWrapper>
    )
}

export default GamePage