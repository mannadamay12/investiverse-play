export interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_investment: {
    id: "first_investment",
    title: "First Steps",
    description: "Made your first investment",
    xp: 100,
    icon: "💰"
  },
  diversified_portfolio: {
    id: "diversified_portfolio",
    title: "Diversification Master",
    description: "Invest in 5 different stocks",
    xp: 250,
    icon: "🎯"
  },
  watch_and_learn: {
    id: "watch_and_learn",
    title: "Market Observer",
    description: "Add 3 stocks to your watchlist",
    xp: 50,
    icon: "👀"
  }
};
