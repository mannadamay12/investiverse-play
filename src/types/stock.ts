export interface StockDataPoint {
  date: string;
  value: number;
}

export interface StockDailyData {
  [date: string]: number;
}

export interface StockData {
  [symbol: string]: StockDailyData;
}

export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  tag: string;
}

export interface EnhancedStockData extends StockInfo {
  historicalData: StockDataPoint[];
}
