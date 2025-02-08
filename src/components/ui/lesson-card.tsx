import * as React from "react"
import { BookOpen, Check, Lock, ChevronDown, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ProgressRing } from "./progress-ring"

interface LessonCardProps {
  title: string
  description?: string
  completed?: boolean
  locked?: boolean
  xp: number
  progress?: number
  onClick?: () => void
  badge?: string
  className?: string
  children?: React.ReactNode
}

export function LessonCard({
  title,
  description,
  completed,
  locked,
  xp,
  progress = 0,
  onClick,
  badge,
  className,
  children,
}: LessonCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div 
      className={cn(
        "bg-white/80 backdrop-blur rounded-lg border border-border transition-colors",
        locked && "opacity-75",
        !locked && "hover:border-border/80",
        className
      )}
    >
      <div 
        className={cn(
          "p-4 flex items-start gap-4 cursor-pointer",
          locked && "cursor-not-allowed"
        )}
        onClick={() => !locked && setIsExpanded(!isExpanded)}
      >
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          completed ? "bg-success/10 text-success" :
          locked ? "bg-muted text-muted-foreground" :
          "bg-primary/10 text-primary"
        )}>
          {completed ? <Check className="w-5 h-5" /> :
           locked ? <Lock className="w-5 h-5" /> :
           <BookOpen className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">{xp} XP</span>
          </div>
          {progress > 0 && <ProgressRing progress={progress} size={32} />}
          <ChevronDown className={cn(
            "w-5 h-5 transition-transform",
            isExpanded && "transform rotate-180"
          )} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
