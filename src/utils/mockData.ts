export interface HistoricalDataPoint {
  date: string;
  value: number;
}

export const generateHistoricalData = (days: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const baseValue = 100;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const randomChange = (Math.random() - 0.5) * 2;
    const value = baseValue + (randomChange * 10);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100
    });
  }
  
  return data;
};
