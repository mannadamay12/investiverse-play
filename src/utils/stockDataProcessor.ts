import stockData from '../assets/dow30_daily_close.json';

export interface StockDataPoint {
  date: string;
  value: number;
}

export const processStockData = (symbol: string): StockDataPoint[] => {
  if (!stockData[symbol]) return [];

  return Object.entries(stockData[symbol])
    .map(([date, price]) => ({
      date,
      value: typeof price === 'number' ? Number(price.toFixed(2)) : 0
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getAvailableSymbols = (): string[] => {
  return Object.keys(stockData);
};