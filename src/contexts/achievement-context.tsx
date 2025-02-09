import * as React from "react";
import { Achievement, ACHIEVEMENTS } from "@/types/achievements";
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';

interface AchievementState {
  earned: string[];
  totalXp: number;
}

interface AchievementContextType {
  state: AchievementState;
  awardAchievement: (id: string) => void;
  hasAchievement: (id: string) => boolean;
  getProgress: (id: string) => number;
}

export const AchievementContext = React.createContext<AchievementContextType | null>(null);

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AchievementState>({
    earned: [],
    totalXp: 0
  });
  const { toast } = useToast();

  const awardAchievement = React.useCallback((id: string) => {
    if (state.earned.includes(id)) return;

    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return;

    setState(prev => ({
      earned: [...prev.earned, id],
      totalXp: prev.totalXp + achievement.xp
    }));

    // Show achievement toast
    toast({
      title: `${achievement.icon} Achievement Unlocked!`,
      description: `${achievement.title} - ${achievement.description}`,
    });

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [state.earned, toast]);

  const hasAchievement = React.useCallback((id: string) => {
    return state.earned.includes(id);
  }, [state.earned]);

  const getProgress = React.useCallback((id: string) => {
    // Implementation would depend on achievement type
    return 0;
  }, []);

  const value = React.useMemo(() => ({
    state,
    awardAchievement,
    hasAchievement,
    getProgress
  }), [state, awardAchievement, hasAchievement, getProgress]);

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievement() {
  const context = React.useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievement must be used within an AchievementProvider');
  }
  return context;
}
