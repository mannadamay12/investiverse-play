import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"; // Import Outlet
import NavigationBar from "./components/ui/navigation-bar";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Invest from "./pages/Invest";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AchievementProvider } from "@/contexts/achievement-context";
import { SimulationProvider } from "@/contexts/simulation-context";
import { useEffect } from "react"; // Import useEffect

const queryClient = new QueryClient();

const App = () => {
    useEffect(() => {
        const navbar = document.getElementById("navbar"); // Get the navbar element
        if (navbar) {
            const navbarHeight = navbar.offsetHeight;
            document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
        }
    }, []); // Empty dependency array ensures this runs only once after initial render

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <SimulationProvider>
                    <AchievementProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                            <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                                {/* Main content container */}
                                <main className="flex-grow pb-[var(--navbar-height)]">
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/learn" element={<Learn />} />
                                        <Route path="/invest" element={<Invest />} />
                                        <Route path="/leaderboard" element={<Leaderboard />} />
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </main>
                                <NavigationBar />
                            </div>
                        </BrowserRouter>
                    </AchievementProvider>
                </SimulationProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;