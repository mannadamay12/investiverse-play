import * as React from "react"
import { BookOpen, GraduationCap } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Toggle } from "@/components/ui/toggle"
import { Quiz } from "@/components/ui/quiz"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import DOMPurify from 'dompurify'

interface LessonModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lesson: {
    title: string
    content?: string
    quiz?: {
      question: string
      options: string[]
      correctAnswer: number
    }
  }
  onComplete?: (success: boolean) => void
}

export function LessonModal({
  open,
  onOpenChange,
  lesson,
  onComplete,
}: LessonModalProps) {
  const [mode, setMode] = React.useState<"learn" | "quiz">("learn")
  const [completed, setCompleted] = React.useState(false)

  const handleQuizComplete = (correct: boolean) => {
    setCompleted(true)
    onComplete?.(correct)
  }

  const sanitizedContent = React.useMemo(() => {
    return lesson.content ? DOMPurify.sanitize(lesson.content) : '';
  }, [lesson.content]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <div className="flex flex-col h-[80vh]">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">{lesson.title}</h2>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Toggle
                pressed={mode === "learn"}
                onPressedChange={() => setMode("learn")}
                className="gap-2"
                aria-label="Show lesson content"
              >
                <BookOpen className="h-4 w-4" />
                Learn
              </Toggle>
              <Toggle
                pressed={mode === "quiz"}
                onPressedChange={() => setMode("quiz")}
                className="gap-2"
                aria-label="Show quiz"
              >
                <GraduationCap className="h-4 w-4" />
                Quiz
              </Toggle>
            </div>
          </div>

          <ScrollArea className="flex-1 px-1">
            {mode === "learn" && (
              <div 
                className="prose prose-sm dark:prose-invert max-w-none py-4"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}
            
            {mode === "quiz" && lesson.quiz && (
              <div className="py-4">
                <Quiz
                  question={lesson.quiz.question}
                  options={lesson.quiz.options}
                  correctAnswer={lesson.quiz.correctAnswer}
                  onComplete={handleQuizComplete}
                />
                {completed && (
                  <Button 
                    className="mt-4 w-full" 
                    onClick={() => onOpenChange(false)}
                  >
                    Complete Lesson
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}