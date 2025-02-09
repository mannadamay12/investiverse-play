export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  level: {
    name: string;
    color: string;
    currentXp: number;
    nextLevelXp: number;
  };
  stats: {
    totalXp: number;
    lessonsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    portfolioValue: number;
    portfolioGrowth: number;
  };
  achievements: Achievement[];
  badges: Badge[];
  friends: {
    count: number;
    following: number;
    followers: number;
  };
  settings: {
    notifications: {
      achievements: boolean;
      friendRequests: boolean;
      dailyQuests: boolean;
    };
    privacy: {
      showPortfolio: boolean;
      showAchievements: boolean;
      showFriends: boolean;
    };
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  featured: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  progress?: number;
  earnedAt?: string;
}
