import { create } from 'zustand';
import { Portfolio } from '../types/portfolio';
import stockData from '../assets/dow30_daily_close.json';

interface SimulationState {
  portfolio: Portfolio[];  // Array of user's stock holdings
  watchlist: string[];    // Array of stock symbols user is watching
  cash: number;           // User's available cash

  // Functions to modify state
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  executeTrade: (symbol: string, shares: number, price: number) => void;
}

export const useSimulation = create<SimulationState>((set) => ({
  portfolio: [],
  watchlist: [],
  cash: 10000,

  addToWatchlist: (symbol) => set((state) => ({
    watchlist: state.watchlist.includes(symbol) 
      ? state.watchlist 
      : [...state.watchlist, symbol]
  })),

  removeFromWatchlist: (symbol) => set((state) => ({
    watchlist: state.watchlist.filter(s => s !== symbol)
  })),

  executeTrade: (symbol, shares, price) => set((state) => {
    const totalCost = shares * price;
    if (totalCost > state.cash) return state;

    const existingPosition = state.portfolio.find(p => p.symbol === symbol);
    const newPortfolio = existingPosition
      ? state.portfolio.map(p => 
          p.symbol === symbol
            ? {
                symbol,
                shares: p.shares + shares,
                averagePrice: (p.averagePrice * p.shares + price * shares) / (p.shares + shares)
              }
            : p
        )
      : [...state.portfolio, { symbol, shares, averagePrice: price }];

    return {
      portfolio: newPortfolio,
      cash: state.cash - totalCost
    };
  }),
}));
