import * as React from "react";
import { Trophy, Sparkles, Users, Lock, BookOpen, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "@/components/ui/page-container";
import { TradingSimulator } from "@/components/ui/trading-simulator";
import { Quiz } from "@/components/ui/quiz";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAchievements } from "@/contexts/useAchievements";
import { SimulationProvider } from "@/contexts/simulation-context";

// Define the type for a module
interface Module {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: "completed" | "locked" | "in-progress";
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  locked?: boolean;
  xp: number;
}

// Mock data - in a real app this would come from an API
const modules: Module[] = [
  {
    id: 1,
    title: "Investing Basics",
    description: "Foundation of successful investing",
    progress: 100,
    status: "completed",
    lessons: [
      {
        id: 1,
        title: "What is Investing?",
        description: "Introduction to investing",
        completed: true,
        xp: 50,
      },
      {
        id: 2,
        title: "Types of Investments",
        description: "Different types of investments",
        completed: true,
        xp: 50,
      },
      {
        id: 3,
        title: "Risk and Return",
        description: "Understanding risk and return",
        completed: true,
        xp: 50,
      },
    ],
  },
  {
    id: 2,
    title: "Stock Market Basics",
    description: "Understanding how stocks work",
    progress: 50,
    status: "in-progress",
    lessons: [
      {
        id: 4,
        title: "What are Stocks?",
        description: "Introduction to stocks",
        completed: true,
        xp: 50,
      },
      {
        id: 5,
        title: "How to Buy Stocks",
        description: "Guide to buying stocks",
        completed: false,
        xp: 50,
      },
      {
        id: 6,
        title: "Market Analysis",
        description: "Analyzing the stock market",
        completed: false,
        locked: true,
        xp: 50,
      },
    ],
  },
  {
    id: 3,
    title: "Advanced Strategies",
    description: "Take your investing to the next level",
    progress: 0,
    status: "locked",
    lessons: [
      {
        id: 7,
        title: "Portfolio Diversification",
        description: "Diversifying your portfolio",
        completed: false,
        locked: true,
        xp: 100,
      },
      {
        id: 8,
        title: "Technical Analysis",
        description: "Using technical analysis",
        completed: false,
        locked: true,
        xp: 100,
      },
      {
        id: 9,
        title: "Investment Strategies",
        description: "Advanced investment strategies",
        completed: false,
        locked: true,
        xp: 100,
      },
    ],
  },
];

const Learn = () => {
  const [userXp, setUserXp] = React.useState(150);
  const { checkAchievement } = useAchievements();
  const [completedLessons, setCompletedLessons] = React.useState<number[]>([]);
  const totalProgress = Math.round(
    (modules.reduce((acc, m) => acc + m.progress, 0) / (modules.length * 100)) * 100
  );

  const handleLessonComplete = (lessonId: number, xpGained: number) => {
    setCompletedLessons((prev) => [...prev, lessonId]);
    setUserXp((prev) => prev + xpGained);
    checkAchievement("lesson_complete", completedLessons.length + 1);
  };

  const canAccessModule = (moduleIndex: number) => {
    if (moduleIndex === 0) return true;
    const prevModule = modules[moduleIndex - 1];
    return prevModule.progress === 100;
  };

  return (
    <PageContainer className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Learning Path</h1>
        <p className="text-gray-600">Master the art of investing through fun lessons</p>
      </div>

      <div className="max-w-xl mx-auto bg-white/50 backdrop-blur border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-medium">{userXp} XP</span>
          </div>
          <span className="text-sm text-muted-foreground">{totalProgress}% Complete</span>
        </div>
        <Progress value={totalProgress} />
      </div>

      <SimulationProvider>
        <TradingSimulator />
      </SimulationProvider>

      <div className="space-y-4">
        {modules.map((module, index) => (
          <ModuleCard
            key={module.id}
            title={module.title}
            description={module.description}
            status={module.status}
            lessons={module.lessons}
            isAccessible={canAccessModule(index)}
            handleLessonComplete={handleLessonComplete}
          />
        ))}
      </div>
    </PageContainer>
  );
};

const ModuleCard = ({ title, description, status, lessons, isAccessible, handleLessonComplete }) => (
  <div className={`bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm ${status === "locked" && "opacity-75"}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-sm ${status === "completed" ? "bg-success/10 text-success" : status === "in-progress" ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-600"}`}>
        {status === "completed" ? "Completed" : status === "in-progress" ? "In Progress" : "Locked"}
      </div>
    </div>
    <div className="space-y-3">
      {lessons.map((lesson, index) => (
        <LessonItem key={index} {...lesson} isAccessible={isAccessible} handleLessonComplete={handleLessonComplete} />
      ))}
    </div>
  </div>
);

const LessonItem = ({ title, description, completed, locked, xp, isAccessible, handleLessonComplete }) => (
  <div className={`flex items-center gap-4 p-3 rounded-lg ${locked ? 'opacity-50' : 'hover:bg-gray-50'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-success/10 text-success' : locked ? 'bg-gray-200 text-gray-400' : 'bg-primary/10 text-primary'}`}>
      {completed ? <Check className="w-4 h-4" /> : locked ? <Lock className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
    </div>
    <div className="flex-1">
      <span className="font-medium">{title}</span>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <span className="text-sm text-gray-600">{xp} XP</span>
    {!completed && !locked && isAccessible && (
      <Button onClick={() => handleLessonComplete(title, xp)}>Start Lesson</Button>
    )}
  </div>
);

export default Learn;
