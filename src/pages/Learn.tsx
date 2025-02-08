import * as React from "react";
import { Trophy, Sparkles, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "@/components/ui/page-container";
import { TradingSimulator } from "@/components/ui/trading-simulator";
import { LessonCard } from "@/components/ui/lesson-card";
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
  status: "completed" | "locked";
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
  quiz?: QuizProps;
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
        title: "Lesson 1",
        description: "Introduction to investing",
        completed: true,
        xp: 50,
      },
      // Add more lessons...
    ],
  },
  // Add more modules...
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
    <PageContainer className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Learning Path</h1>
        <p className="text-gray-600">Master the art of investing through fun lessons</p>

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
      </div>

      <SimulationProvider>
        <TradingSimulator />
      </SimulationProvider>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {modules.map((module, index) => {
            const isAccessible = canAccessModule(index);

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className={cn(!isAccessible && "opacity-50")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">{module.title}</h2>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">32 peers learning</span>
                  </div>
                </div>

                <div className="grid gap-4">
                  {module.lessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      title={lesson.title}
                      description={lesson.description}
                      completed={lesson.completed}
                      locked={!isAccessible}
                      xp={lesson.xp}
                      progress={lesson.completed ? 100 : 0}
                      badge={lesson.completed ? "Completed" : module.status === "locked" ? "Locked" : ""}
                      onClick={() => {
                        if (!lesson.completed && isAccessible) {
                          handleLessonComplete(lesson.id, lesson.xp);
                        }
                      }}
                    >
                      {lesson.quiz && !lesson.completed && isAccessible && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Quiz
                            {...lesson.quiz}
                            onComplete={(correct) => {
                              if (correct) {
                                handleLessonComplete(lesson.id, lesson.xp);
                                checkAchievement("quiz_complete", 1);
                              }
                            }}
                          />
                        </motion.div>
                      )}
                    </LessonCard>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
};

export default Learn;