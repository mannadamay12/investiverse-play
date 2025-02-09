import { Trophy, ChartLine, BookOpen, Flame } from "lucide-react";
import { type UserProfile } from "@/types/profile";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
}

const StatCard = ({ icon, label, value, trend }: StatCardProps) => (
  <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center gap-2 text-primary mb-2">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    {trend && <div className="text-sm text-gray-500">{trend}</div>}
  </div>
);

export function StatsOverview({ profile }: { profile: UserProfile }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Trophy className="w-5 h-5" />}
        label="Total XP"
        value={profile.stats.totalXp.toLocaleString()}
        trend="Level 5"
      />
      <StatCard
        icon={<ChartLine className="w-5 h-5" />}
        label="Portfolio Value"
        value={`$${profile.stats.portfolioValue.toLocaleString()}`}
        trend={`${profile.stats.portfolioGrowth > 0 ? '+' : ''}${profile.stats.portfolioGrowth}% today`}
      />
      <StatCard
        icon={<BookOpen className="w-5 h-5" />}
        label="Lessons"
        value={profile.stats.lessonsCompleted.toString()}
      />
      <StatCard
        icon={<Flame className="w-5 h-5" />}
        label="Streak"
        value={`${profile.stats.currentStreak} days`}
        trend={`Longest: ${profile.stats.longestStreak} days`}
      />
    </div>
  );
}
