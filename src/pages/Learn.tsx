import * as React from "react";
import { Trophy, BookOpen, Check, Lock } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLessons } from "@/hooks/useLessons";
import { SimulationProvider } from "@/contexts/simulation-context";
import { TradingSimulator } from "@/components/ui/trading-simulator";
import { LessonModal } from "@/components/ui/lesson-modal";
import { Category, Lesson, LessonContent } from "@/types/lesson";

interface ModuleCardProps {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  lessons: Lesson[];
  isAccessible: boolean;
  handleLessonComplete: (lessonId: string, xp: number) => void;
  handleLessonStart: (lesson: SelectedLesson) => void;
}

interface LessonItemProps extends Lesson {
  isAccessible: boolean;
  handleLessonStart: (lesson: { id: string; title: string; xp: number }) => void;
}

interface SelectedLesson {
  id: string;
  title: string;
  xp: number;
}

const Learn = () => {
  const [userXp, setUserXp] = React.useState(150);
  const { categories, loading, error, getCategoryProgress, getCategoryStatus } = useLessons();
  const [selectedLesson, setSelectedLesson] = React.useState<SelectedLesson | null>(null);

  const totalProgress = categories.length > 0
    ? Math.round(
        categories.reduce((acc, cat) => acc + getCategoryProgress(cat.id), 0) / categories.length
      )
    : 0;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Add this mock lesson content (you should probably move this to your lessons.json)
  const getLessonContent = (lessonId: string): LessonContent => ({
    title: categories
      .flatMap(c => c.lessons)
      .find(l => l.id === lessonId)?.title || "",
    content: `
      <div class="space-y-6">
        <section>
          <h3 class="text-xl font-semibold mb-3">Introduction</h3>
          <p class="text-gray-700">This is an example lesson content. In a real application, this would be much more detailed and structured.</p>
        </section>
        
        <section>
          <h3 class="text-xl font-semibold mb-3">Key Concepts</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li class="text-gray-700">First key point about ${lessonId}</li>
            <li class="text-gray-700">Second key point about investing</li>
            <li class="text-gray-700">Third key point with examples</li>
          </ul>
        </section>
        
        <section>
          <h3 class="text-xl font-semibold mb-3">Practical Application</h3>
          <p class="text-gray-700">Here's how you can apply these concepts in real-world scenarios...</p>
        </section>
      </div>
    `,
    quiz: {
      question: "What is the main purpose of diversification?",
      options: [
        "To maximize returns",
        "To reduce risk",
        "To increase trading frequency",
        "To minimize taxes"
      ],
      correctAnswer: 1
    }
  });

  const handleLessonStart = (lesson: SelectedLesson) => {
    setSelectedLesson(lesson);
  };

  const handleLessonComplete = (lessonId: string, xp: number) => {
    // Your existing completion logic
    setUserXp(prev => prev + xp);
    setSelectedLesson(null);
  };

  return (
    <PageContainer className="space-y-6 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Learning Path</h1>
        <p className="text-sm md:text-base text-gray-600">Master the art of investing through fun lessons</p>
      </div>

      <div className="w-full md:max-w-xl mx-auto bg-white/50 backdrop-blur border rounded-lg p-3 md:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 md:gap-2">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="text-sm md:text-base font-medium">{userXp} XP</span>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground">{totalProgress}% Complete</span>
        </div>
        <Progress value={totalProgress} />
      </div>

      <SimulationProvider>
        <div className="w-full overflow-x-auto">
          <TradingSimulator />
        </div>
      </SimulationProvider>

      {selectedLesson && (
        <LessonModal
          open={!!selectedLesson}
          onOpenChange={(open) => !open && setSelectedLesson(null)}
          lesson={getLessonContent(selectedLesson.id)}
          onComplete={(success) => {
            if (success) {
              handleLessonComplete(selectedLesson.id, selectedLesson.xp);
            }
          }}
        />
      )}

      <div className="space-y-4">
        {categories.map((category, index) => (
          <ModuleCard
            key={category.id}
            title={category.title}
            description={category.description}
            status={getCategoryStatus(category.id)}
            lessons={category.lessons}
            isAccessible={index === 0 || getCategoryStatus(categories[index - 1].id) === 'completed'}
            handleLessonComplete={handleLessonComplete}
            handleLessonStart={handleLessonStart}
          />
        ))}
      </div>
    </PageContainer>
  );
};

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, status, lessons, isAccessible, handleLessonComplete, handleLessonStart }) => (
  <div className={`bg-white/80 backdrop-blur p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm ${status === "locked" && "opacity-75"}`}>
    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-2 md:gap-4">
      <div>
        <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
        <p className="text-sm md:text-base text-gray-600">{description}</p>
      </div>
      <div className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${status === "completed" ? "bg-success/10 text-success" : status === "in-progress" ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-600"}`}>
        {status === "completed" ? "Completed" : status === "in-progress" ? "In Progress" : "Locked"}
      </div>
    </div>
    <div className="space-y-3">
      {lessons.map((lesson, index) => (
        <LessonItem key={index} {...lesson} isAccessible={isAccessible} handleLessonStart={handleLessonStart} />
      ))}
    </div>
  </div>
);

const LessonItem: React.FC<LessonItemProps> = ({ id, title, description, completed, locked, xp, isAccessible, handleLessonStart }) => (
  <div className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-3 rounded-lg ${locked ? 'opacity-50' : 'hover:bg-gray-50'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-success/10 text-success' : locked ? 'bg-gray-200 text-gray-400' : 'bg-primary/10 text-primary'}`}>
      {completed ? <Check className="w-4 h-4" /> : locked ? <Lock className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
    </div>
    <div className="flex-1">
      <span className="font-medium text-sm md:text-base">{title}</span>
      <p className="text-xs md:text-sm text-gray-600">{description}</p>
    </div>
    <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
      <span className="text-xs md:text-sm text-gray-600">{xp} XP</span>
      {!completed && !locked && isAccessible && (
        <Button 
          size="sm" 
          onClick={() => handleLessonStart({ id, title, xp })}
        >
          Start Lesson
        </Button>
      )}
    </div>
  </div>
);

export default Learn;
