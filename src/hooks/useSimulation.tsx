import { useState, useEffect } from "react";
import { generateHistoricalData, HistoricalDataPoint } from "@/utils/mockData";
import { Portfolio } from "@/types";
import stockData from '../assets/dow30_daily_close.json';
interface SimulationState {
  portfolio: Portfolio[];
  watchlist: string[];
  historicalData: HistoricalDataPoint[];
  portfolioValue: number;
}

export const useSimulation = () => {
  const getHistoricalPrices = (symbol: string) => {
    return Object.entries(stockData[symbol] || {})
      .map(([date, price]) => ({
        date,
        price
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
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
        historicalData: getHistoricalPrices(prev.portfolio[0]?.symbol || 'AAPL')
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
