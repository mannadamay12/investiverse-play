export interface HistoricalDataPoint {
  date: string;
  value: number;
}

export const generateHistoricalData = (
  days: number = 30,
  startValue: number = 10000,
  volatility: number = 0.02
): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  let currentValue = startValue;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add random walk with specified volatility
    const change = currentValue * (Math.random() * volatility * 2 - volatility);
    currentValue += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(currentValue, 0) // Ensure value doesn't go negative
    });
  }
  
  return data;
};

export const mockStockData = {
  AAPL: { name: "Apple Inc.", price: 150.23, change: 1.2, tag: "Tech Giant" },
  GOOGL: { name: "Alphabet Inc.", price: 2750.50, change: -0.5, tag: "Tech Leader" },
  MSFT: { name: "Microsoft Corp.", price: 285.30, change: 0.8, tag: "Stable Growth" },
};
