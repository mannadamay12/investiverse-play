import { StockData, StockDataPoint, EnhancedStockData } from '@/types/stock';
import stockData from '@/assets/dow30_daily_close.json';

// Mock company names for demonstration
const COMPANY_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corporation',
  // Add more company names as needed
};

export const processStockData = (data: Record<string, number>): StockDataPoint[] => {
  return Object.entries(data)
    .map(([date, value]) => ({
      date,
      value: Number(value)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getLatestPrice = (historicalData: StockDataPoint[]): number => {
  return historicalData.length > 0 ? historicalData[historicalData.length - 1].value : 0;
};

export const calculatePriceChange = (historicalData: StockDataPoint[]): number => {
  if (historicalData.length < 2) return 0;
  const latest = historicalData[historicalData.length - 1].value;
  const previous = historicalData[historicalData.length - 2].value;
  return ((latest - previous) / previous) * 100;
};

export const getStockDataForSymbol = (allData: StockData, symbol: string): StockDataPoint[] => {
  const symbolData = allData[symbol];
  return symbolData ? processStockData(symbolData) : [];
};

export const getEnhancedStockData = (symbol: string): EnhancedStockData => {
  const historicalData = getStockDataForSymbol(stockData as StockData, symbol);
  const price = getLatestPrice(historicalData);
  const change = calculatePriceChange(historicalData);

  return {
    symbol,
    name: COMPANY_NAMES[symbol] || symbol,
    price,
    change,
    tag: change >= 0 ? 'up' : 'down',
    historicalData
  };
};

export const getAvailableSymbols = (): string[] => {
  return Object.keys(stockData);
};