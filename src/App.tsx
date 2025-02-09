import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavigationBar from "./components/ui/navigation-bar";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Invest from "./pages/Invest";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AchievementProvider } from "@/contexts/achievement-context";
import { SimulationProvider } from "@/contexts/simulation-context";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import { UserProvider } from '@/contexts/user-context';

const queryClient = new QueryClient();

// New component to handle layout and routing
const AppContent = () => {
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const navbar = document.getElementById("navbar");
        if (navbar) {
            const navbarHeight = navbar.offsetHeight;
            document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
        }
    }, []);

    const showNavbar = location.pathname !== '/';

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <main className={`flex-grow ${showNavbar ? 'pb-20' : ''}`}>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/invest" element={<Invest />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<Landing />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            {showNavbar && <NavigationBar activeTab={activeTab} onChangeTab={setActiveTab} />}
        </div>
    );
};

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <TooltipProvider>
                    <SimulationProvider>
                        <AchievementProvider>
                            <BrowserRouter>
                                <Toaster />
                                <Sonner />
                                <AppContent />
                            </BrowserRouter>
                        </AchievementProvider>
                    </SimulationProvider>
                </TooltipProvider>
            </UserProvider>
        </QueryClientProvider>
    );
};

export default App;