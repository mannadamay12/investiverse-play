
import { Settings, Trophy, ChartLine, BookOpen, Bell } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}

interface AchievementProps {
  icon: React.ReactNode;
  title: string;
  date: string;
  xp: string;
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const StatCard = ({ icon, label, value, trend }: StatCardProps) => (
  <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center gap-2 text-primary mb-2">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-500">{trend}</div>
  </div>
);

const Achievement = ({ icon, title, date, xp }: AchievementProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
      <div>
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-500">{date}</div>
      </div>
    </div>
    <div className="text-sm font-medium text-primary">+{xp} XP</div>
  </div>
);

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

const Profile = () => {
  return (
    <PageContainer className="space-y-6">
      {/* Profile Header */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-white/80 backdrop-blur border-2 border-primary mx-auto overflow-hidden">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser"
            alt="Profile"
            className="w-full h-full"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alex Thompson</h1>
          <p className="text-gray-600">Investment Novice</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" /> Edit Profile
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          label="Total XP"
          value="3,450"
          trend="+250 this week"
        />
        <StatCard
          icon={<ChartLine className="w-5 h-5" />}
          label="Investment Value"
          value="$1,234.56"
          trend="+2.4% today"
        />
      </div>

      {/* Achievements */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
        <div className="space-y-4">
          <Achievement
            icon={<BookOpen className="w-5 h-5" />}
            title="First Lesson Completed"
            date="2 days ago"
            xp="50"
          />
          <Achievement
            icon={<ChartLine className="w-5 h-5" />}
            title="First Investment"
            date="5 days ago"
            xp="100"
          />
          <Achievement
            icon={<Trophy className="w-5 h-5" />}
            title="Top 10 on Leaderboard"
            date="1 week ago"
            xp="150"
          />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            icon={<Bell className="w-5 h-5" />}
            title="Daily Quest Completed"
            description="Completed the daily investment challenge"
            time="2 hours ago"
          />
          <ActivityItem
            icon={<ChartLine className="w-5 h-5" />}
            title="Investment Made"
            description="Invested in ETF fund"
            time="5 hours ago"
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
