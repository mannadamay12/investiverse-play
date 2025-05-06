import { type LeaderboardEntry } from "@/types/leaderboard"

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

// ✅ Real API fetch with correct mapping
export async function fetchLeaderboardData(): Promise<LeaderboardEntry[]> {
  const res = await fetch("http://localhost:8000/api/leaderboard")
  if (!res.ok) throw new Error("Failed to fetch leaderboard")

  const data = await res.json()

  return data.map((entry: any) => ({
    id: entry.id,
    name: entry.name,
    avatar: entry.avatar,
    position: entry.position,
    xp: entry.xp,
    level: getLevelInfo(entry.xp),
    streak: entry.streak ?? 0,
    recentAchievement: entry.recentachievement ?? undefined,
    xpBreakdown: {
      quizzes: 0,       // Default values; update if backend provides actual data
      investing: 0,
      challenges: 0
    },
    badges: []          // Default empty; update if backend provides badges
  }))
}
