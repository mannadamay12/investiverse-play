export * from './stock';
export * from './portfolio';

export interface Portfolio {
  symbol: string;
  shares: number;
  averagePrice: number;
}

export interface Trade {
  symbol: string;
  shares: number;
  price: number;
  timestamp: Date;
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
}
