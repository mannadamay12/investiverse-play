import * as React from "react"

interface PortfolioHolding {
  symbol: string
  shares: number
  averagePrice: number
  lastPrice: number
}

interface SimulationState {
  balance: number
  portfolio: PortfolioHolding[]
  completedTutorials: string[]
  watchlist: string[]
  historicalData: {
    date: string
    value: number
  }[]
}

interface SimulationContext {
  state: SimulationState
  showTutorial: (id: string) => void
  completeTutorial: (id: string) => void
  executeTrade: (symbol: string, shares: number, price: number) => void
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
}

const SimulationContext = React.createContext<SimulationContext | null>(null)

function updatePortfolio(
  portfolio: PortfolioHolding[],
  symbol: string,
  shares: number,
  price: number
): PortfolioHolding[] {
  const existingPosition = portfolio.find((p) => p.symbol === symbol);
  
  if (existingPosition) {
    const totalShares = existingPosition.shares + shares;
    const totalCost = existingPosition.shares * existingPosition.averagePrice + shares * price;
    const averagePrice = totalCost / totalShares;
    
    return portfolio.map((p) =>
      p.symbol === symbol
        ? { ...p, shares: totalShares, averagePrice, lastPrice: price }
        : p
    );
  }
  
  return [...portfolio, { symbol, shares, averagePrice: price, lastPrice: price }];
}

function generateHistoricalData(days: number, startValue: number) {
  let currentValue = startValue;
  return Array.from({ length: days }, (_, i) => {
    // Generate smoother price movements
    const change = (Math.random() - 0.45) * (currentValue * 0.02); // 2% max daily change
    currentValue += change;
    
    return {
      date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      value: Math.max(currentValue, 0) // Ensure value doesn't go negative
    };
  });
}

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SimulationState>({
    balance: 10000,
    portfolio: [],
    completedTutorials: [],
    watchlist: [],
    historicalData: generateHistoricalData(30, 10000) // 30 days of data starting at $10,000
  })

  const value = React.useMemo(() => ({
    state,
    showTutorial: (id: string) => {
      // Tutorial logic here
    },
    completeTutorial: (id: string) => {
      setState(prev => ({
        ...prev,
        completedTutorials: [...prev.completedTutorials, id]
      }))
    },
    executeTrade: (symbol: string, shares: number, price: number) => {
      setState(prev => ({
        ...prev,
        balance: prev.balance - (shares * price),
        portfolio: updatePortfolio(prev.portfolio, symbol, shares, price)
      }))
    },
    addToWatchlist: (symbol: string) => {
      setState(prev => ({
        ...prev,
        watchlist: [...new Set([...prev.watchlist, symbol])]
      }))
    },
    removeFromWatchlist: (symbol: string) => {
      setState(prev => ({
        ...prev,
        watchlist: prev.watchlist.filter(s => s !== symbol)
      }))
    }
  }), [state])

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  )
}

export { SimulationContext };
