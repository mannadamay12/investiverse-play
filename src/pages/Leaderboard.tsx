import { useEffect, useState } from "react"
import { fetchLeaderboardData, getLevelInfo } from "@/lib/leaderboard"
import { type LeaderboardEntry } from "@/types/leaderboard"

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboardData()
      .then(setData)
      .catch(err => {
        console.error("Failed to fetch leaderboard:", err)
        setError("Unable to load leaderboard.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4 text-lg">Loading leaderboard...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>
      <ul className="space-y-4">
        {data.map((user) => {
          const levelInfo = getLevelInfo(user.xp)
          return (
            <li
              key={user.id}
              className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-lg">{user.name}</div>
                  {/* <div className={`text-sm ${levelInfo.color}`}>
                    {levelInfo.name} • XP: {user.xp}
                  </div> */}
                  {user.recentAchievement && (
                    <div className="text-xs text-green-500 mt-1">
                      🎉 {user.recentAchievement}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">#{user.position}</div>
                <div className="text-sm text-gray-500">Streak: {user.streak} 🔥</div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
