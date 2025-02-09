// NavigationBar.jsx
import { Home, Trophy, BookOpen, ChartLine, User } from "lucide-react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <div id="navbar" className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 py-2 px-4 z-50">
      <nav className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center">
          <NavItem icon={<Home className="w-6 h-6" />} label="Home" to="/" />
          <NavItem icon={<BookOpen className="w-6 h-6" />} label="Learn" to="/learn" />
          <NavItem icon={<ChartLine className="w-6 h-6" />} label="Invest" to="/invest" />
          <NavItem icon={<Trophy className="w-6 h-6" />} label="Leaderboard" to="/leaderboard" />
          <NavItem icon={<User className="w-6 h-6" />} label="Profile" to="/profile" />
        </ul>
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) => (
  <li>
    <Link
      to={to}
      className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-primary transition-colors duration-200"
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Link>
  </li>
);

export default NavigationBar;