import { type LeaderboardEntry, type LeaderboardScope, type LeaderboardTimeframe } from "@/types/leaderboard"

export const LEVEL_COLORS = {
  bronze: "text-amber-600",
  silver: "text-gray-400",
  gold: "text-yellow-400",
  platinum: "text-cyan-400",
  master: "text-purple-500"
} as const

export function getLevelInfo(xp: number) {
  if (xp >= 10000) return { name: "Master", color: LEVEL_COLORS.master }
  if (xp >= 7500) return { name: "Platinum", color: LEVEL_COLORS.platinum }
  if (xp >= 5000) return { name: "Gold", color: LEVEL_COLORS.gold }
  if (xp >= 2500) return { name: "Silver", color: LEVEL_COLORS.silver }
  return { name: "Bronze", color: LEVEL_COLORS.bronze }
}

export function generateMockLeaderboardData(
  scope: LeaderboardScope,
  timeframe: LeaderboardTimeframe
): LeaderboardEntry[] {
  // Mock data generation
  return Array.from({ length: 100 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `${scope === 'friends' ? 'Friend' : 'Player'} ${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Player${i + 1}`,
    position: i + 1,
    xp: Math.round((10000 - i * 50) * (timeframe === 'daily' ? 0.1 : timeframe === 'weekly' ? 0.5 : 1)),
    level: getLevelInfo(10000 - i * 50),
    streak: Math.floor(Math.random() * 10),
    recentAchievement: Math.random() > 0.7 ? "New Portfolio Milestone!" : undefined,
    xpBreakdown: {
      quizzes: 35,
      investing: 40,
      challenges: 25,
    },
    badges: [
      {
        id: "quick-learner",
        name: "Quick Learner",
        icon: "📚"
      },
      {
        id: "investment-guru",
        name: "Investment Guru",
        icon: "📈"
      }
    ]
  }))
}
