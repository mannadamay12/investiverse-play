export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  requirement: {
    type: 'lesson_complete' | 'quiz_complete' | 'trade_complete' | 'xp_reached'
    value: number
  }
  xpReward: number
  unlockedAt?: Date
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    requirement: { type: 'lesson_complete', value: 1 },
    xpReward: 50
  },
  {
    id: 'trading_novice',
    title: 'Trading Novice',
    description: 'Complete your first trade',
    icon: '📈',
    requirement: { type: 'trade_complete', value: 1 },
    xpReward: 100
  },
  // Add more achievements...
]
