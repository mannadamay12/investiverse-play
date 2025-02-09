import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { Home, GraduationCap, PiggyBank, Trophy, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

interface NavigationBarProps {
    activeTab: string | null;
    onChangeTab: (tab: string | null) => void;
}

const NavigationBar = ({ activeTab, onChangeTab }: NavigationBarProps) => {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    const tabs = useMemo(() => [
        { title: "Home", icon: Home, to: "/home" },
        { title: "Learn", icon: GraduationCap, to: "/learn" },
        { title: "Invest", icon: PiggyBank, to: "/invest" },
        { title: "Leaderboard", icon: Trophy, to: "/leaderboard" },
        { title: "Profile", icon: User, to: "/profile" },
    ], []);

    useEffect(() => {
        // Find the tab index that matches the current location
        const currentTabIndex = tabs.findIndex(tab => tab.to === location.pathname);
        // Update the active tab with the index and set expanded state to true
        if (currentTabIndex !== -1) {
            onChangeTab(tabs[currentTabIndex].title);
            setIsExpanded(true);
        } else {
            onChangeTab(null);
            setIsExpanded(false);
        }
    }, [location.pathname, onChangeTab, tabs]);

    // Find the active index based on the activeTab prop
    const activeIndex = tabs.findIndex(tab => tab.title === activeTab);

    return (
        <nav id="navbar" className="fixed bottom-0 left-0 right-0 flex justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto">
                <ExpandableTabs
                    tabs={tabs}
                    className="backdrop-blur-md bg-gradient-to-t from-slate-900/95 to-slate-800/80 border-none shadow-lg"
                    activeColor="text-primary"
                    activeIndex={activeIndex}
                    onChange={(index) => {
                        onChangeTab(index !== null ? tabs[index].title : null);
                        setIsExpanded(true);
                    }}
                />
            </div>
        </nav>
    );
};

export default NavigationBar;