import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { Home, GraduationCap, PiggyBank, Trophy, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";

interface NavigationBarProps {
    activeTab: string | null;
    onChangeTab: (tab: string | null) => void;
}

const NavigationBar = ({ activeTab, onChangeTab }: NavigationBarProps) => {
    const location = useLocation();

    const tabs = useMemo(() => [
        { title: "Home", icon: Home, to: "/" },
        { title: "Learn", icon: GraduationCap, to: "/learn" },
        { title: "Invest", icon: PiggyBank, to: "/invest" },
        { title: "Leaderboard", icon: Trophy, to: "/leaderboard" },
        { title: "Profile", icon: User, to: "/profile" },
    ], []);

    useEffect(() => {
        // Find the tab index that matches the current location
        const currentTabIndex = tabs.findIndex(tab => tab.to === location.pathname);
        // Update the active tab with the index
        onChangeTab(currentTabIndex !== -1 ? tabs[currentTabIndex].title : null);
    }, [location.pathname, onChangeTab, tabs]);

    return (
        <nav id="navbar" className="fixed bottom-0 left-0 right-0 flex justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto">
                <ExpandableTabs
                    tabs={tabs}
                    className="backdrop-blur-md bg-background/70 border-none shadow-lg"
                    activeColor="text-primary"
                    onChange={(index) => onChangeTab(index !== null ? tabs[index].title : null)}
                />
            </div>
        </nav>
    );
};

export default NavigationBar;