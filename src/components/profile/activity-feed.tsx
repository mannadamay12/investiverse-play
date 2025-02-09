import { Bell, Trophy, ChartLine, BookOpen } from "lucide-react";
import { type Achievement } from "@/types/profile";

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({ icon, title, description, time }: ActivityItemProps) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
    <div>
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-500">{description}</div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  </div>
);

export function ActivityFeed({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {achievements.slice(0, 5).map((achievement) => (
          <ActivityItem
            key={achievement.id}
            icon={<Trophy className="w-5 h-5" />}
            title={achievement.title}
            description={achievement.description}
            time={new Date(achievement.earnedAt).toLocaleTimeString()}
          />
        ))}
      </div>
    </div>
  );
}
