import { Trophy, TrendingUp, BookOpen, Award, Sparkles } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { NextLessonCard } from "@/components/home/next-lesson-card";
import { MiniChart } from "@/components/ui/mini-chart";
import { PageChat } from "@/components/shared/PageChat";

const Home = () => {
  // Sample data for the mini chart
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
    value: 1000 + Math.random() * 500,
  }));

  return (
    <>
      <PageContainer className="space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <div className="text-sm text-primary font-medium">Day 5 Streak! 🔥</div>
          <h1 className="text-4xl font-bold text-gray-900">Welcome back, Investor!</h1>
          <p className="text-gray-600">Ready to continue your investment journey?</p>
        </div>

        {/* Next Lesson Card */}
        <NextLessonCard />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-primary font-semibold">Portfolio Value</div>
            <div className="text-2xl font-bold">$1,234.56</div>
            <div className="text-success text-sm">+2.4% today</div>
            <MiniChart data={chartData} className="text-success mt-2" />
          </div>
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-primary font-semibold">XP Points</div>
            <div className="text-2xl font-bold">2,450</div>
            <div className="text-sm text-gray-600">20 XP to Level 6!</div>
            <div className="mt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                Top 10% this week
              </span>
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-blue-700" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-900">Tip of the Day</div>
              <div className="text-sm text-blue-700">
                Diversifying your portfolio helps manage risk effectively.
              </div>
            </div>
          </div>
        </div>

        {/* Daily Quests */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Daily Quests</h2>
          <div className="space-y-4">
            <QuestItem
              icon={<BookOpen className="w-5 h-5" />}
              title="Complete Today's Lesson"
              xp="50"
              progress={60}
            />
            <QuestItem
              icon={<TrendingUp className="w-5 h-5" />}
              title="Make Your First Investment"
              xp="100"
              progress={0}
            />
            <QuestItem
              icon={<Trophy className="w-5 h-5" />}
              title="Check the Leaderboard"
              xp="30"
              progress={100}
            />
          </div>
        </div>

        {/* Achievement Showcase */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Achievement title="First Investment" date="2 days ago" />
            <Achievement title="Quick Learner" date="5 days ago" />
            <Achievement title="Social Butterfly" date="1 week ago" />
          </div>
        </div>
      </PageContainer>
      <PageChat />
    </>
  );
};

const QuestItem = ({ icon, title, xp, progress }: { icon: React.ReactNode; title: string; xp: string; progress: number }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-primary">{xp} XP</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </div>
);

const Achievement = ({ title, date }: { title: string; date: string }) => (
  <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-xl p-4 flex flex-col items-center justify-center text-white text-center">
    <Trophy className="w-8 h-8 mb-2" />
    <div className="font-medium text-sm">{title}</div>
    <div className="text-xs opacity-80">{date}</div>
  </div>
);

export default Home;
