// hooks/useInfluxStockData.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface StockHistoryPoint {
  date: string;
  value: number;
}

export const useInfluxStockData = (symbol: string) => {
  const [data, setData] = useState<StockHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: number;

    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/stock-history", {
          params: { symbol },
        });
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching InfluxDB stock history:", err);
      }
    };

    fetchData();
    interval = window.setInterval(fetchData, 5000); // poll every 5 seconds

    return () => clearInterval(interval);
  }, [symbol]);

  return { data, loading };
};
