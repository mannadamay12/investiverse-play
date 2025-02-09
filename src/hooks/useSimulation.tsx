import { useState, useEffect } from "react";
import { generateHistoricalData, HistoricalDataPoint } from "@/utils/mockData";
import { Portfolio } from "@/types";

interface SimulationState {
  portfolio: Portfolio[];
  watchlist: string[];
  historicalData: HistoricalDataPoint[];
  portfolioValue: number;
}

export const useSimulation = () => {
  const [state, setState] = useState<SimulationState>({
    portfolio: [],
    watchlist: [],
    historicalData: generateHistoricalData(),
    portfolioValue: 10000, // Starting portfolio value
  });

  // Update historical data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        historicalData: generateHistoricalData(30, prev.portfolioValue)
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Update historical data when portfolio value changes
  useEffect(() => {
    const newPortfolioValue = calculatePortfolioValue(state.portfolio);
    if (newPortfolioValue !== state.portfolioValue) {
      setState(prev => ({
        ...prev,
        portfolioValue: newPortfolioValue,
        historicalData: generateHistoricalData(30, newPortfolioValue)
      }));
    }
  }, [state.portfolio]);

  const executeTrade = (trade: Trade) => {
    // ...existing code...
  };

  const addToWatchlist = (symbol: string) => {
    // ...existing code...
  };

  const removeFromWatchlist = (symbol: string) => {
    // ...existing code...
  };

  const calculatePortfolioValue = (portfolio: Portfolio[]): number => {
    return portfolio.reduce((total, holding) => total + holding.shares * holding.price, 0);
  };

  return {
    state,
    executeTrade,
    addToWatchlist,
    removeFromWatchlist
  };
};
