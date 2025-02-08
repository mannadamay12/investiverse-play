
import { BookOpen, Check, Lock } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { TradingSimulator } from "@/components/ui/trading-simulator";

const Learn = () => {
  return (
    <PageContainer className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Learning Path</h1>
        <p className="text-gray-600">Master the art of investing through fun lessons</p>
      </div>

      <TradingSimulator />

      <div className="space-y-4">
        {/* Module 1 */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Investing Basics</h2>
              <p className="text-gray-600">Foundation of successful investing</p>
            </div>
            <div className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">
              Completed
            </div>
          </div>
          <div className="space-y-3">
            <LessonItem title="What is Investing?" completed={true} xp="50" />
            <LessonItem title="Types of Investments" completed={true} xp="50" />
            <LessonItem title="Risk and Return" completed={true} xp="50" />
          </div>
        </div>

        {/* Module 2 */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Stock Market Basics</h2>
              <p className="text-gray-600">Understanding how stocks work</p>
            </div>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              In Progress
            </div>
          </div>
          <div className="space-y-3">
            <LessonItem title="What are Stocks?" completed={true} xp="50" />
            <LessonItem title="How to Buy Stocks" completed={false} xp="50" />
            <LessonItem title="Market Analysis" locked={true} xp="50" />
          </div>
        </div>

        {/* Module 3 */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Advanced Strategies</h2>
              <p className="text-gray-600">Take your investing to the next level</p>
            </div>
            <div className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
              Locked
            </div>
          </div>
          <div className="space-y-3">
            <LessonItem title="Portfolio Diversification" locked={true} xp="100" />
            <LessonItem title="Technical Analysis" locked={true} xp="100" />
            <LessonItem title="Investment Strategies" locked={true} xp="100" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

const LessonItem = ({ title, completed, locked, xp }: { title: string; completed?: boolean; locked?: boolean; xp: string }) => (
  <div className={`flex items-center gap-4 p-3 rounded-lg ${locked ? 'opacity-50' : 'hover:bg-gray-50'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-success/10 text-success' : locked ? 'bg-gray-200 text-gray-400' : 'bg-primary/10 text-primary'}`}>
      {completed ? <Check className="w-4 h-4" /> : locked ? <Lock className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
    </div>
    <div className="flex-1">
      <span className="font-medium">{title}</span>
    </div>
    <span className="text-sm text-gray-600">{xp} XP</span>
  </div>
);

export default Learn;
