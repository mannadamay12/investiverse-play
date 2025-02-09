export type LeaderboardTimeframe = "daily" | "weekly" | "allTime";
export type LeaderboardScope = "global" | "friends" | "local";

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  position: number;
  level: {
    name: string;
    color: string;
  };
  streak: number;
  recentAchievement?: string;
  xpBreakdown: {
    quizzes: number;
    investing: number;
    challenges: number;
  };
  badges: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
}

export interface LeaderboardState {
  scope: LeaderboardScope;
  timeframe: LeaderboardTimeframe;
  entries: LeaderboardEntry[];
  userRank: {
    position: number;
    xp: number;
    nextMilestone?: {
      xpNeeded: number;
      playerName: string;
    };
  };
}
