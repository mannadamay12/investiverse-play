import * as React from "react"
import { Achievement, ACHIEVEMENTS } from "@/types/achievements"
import { useToast } from "@/components/ui/use-toast"
// import { useAchievements } from './useAchievements';

interface AchievementContext {
  checkAchievement: (type: Achievement['requirement']['type'], value: number) => void
  unlockedAchievements: Achievement[]
}

const AchievementContext = React.createContext<AchievementContext | null>(null)

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlockedAchievements, setUnlockedAchievements] = React.useState<Achievement[]>([])
  const { toast } = useToast()

  const checkAchievement = React.useCallback((type: Achievement['requirement']['type'], value: number) => {
    ACHIEVEMENTS.forEach(achievement => {
      if (
        achievement.requirement.type === type &&
        value >= achievement.requirement.value &&
        !unlockedAchievements.find(a => a.id === achievement.id)
      ) {
        setUnlockedAchievements(prev => [...prev, { ...achievement, unlockedAt: new Date() }])
        toast({
          title: `🎉 Achievement Unlocked: ${achievement.title}`,
          description: `${achievement.description} (+${achievement.xpReward} XP)`
        })
      }
    })
  }, [unlockedAchievements, toast])

  return (
    <AchievementContext.Provider value={{ checkAchievement, unlockedAchievements }}>
      {children}
    </AchievementContext.Provider>
  )
}

export { AchievementContext };
