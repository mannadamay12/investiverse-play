
import { useState } from "react";
import { ArrowUp, ArrowDown, RefreshCcw } from "lucide-react";
import { Button } from "./button";

interface Stock {
  name: string;
  price: number;
  trend: "up" | "down" | "neutral";
  change: number;
}

export const TradingSimulator = () => {
  const [balance, setBalance] = useState(10000);
  const [shares, setShares] = useState(0);
  const [stock, setStock] = useState<Stock>({
    name: "TECH Corp",
    price: 100,
    trend: "neutral",
    change: 0,
  });

  const buyShares = () => {
    if (balance >= stock.price) {
      setShares(shares + 1);
      setBalance(balance - stock.price);
    }
  };

  const sellShares = () => {
    if (shares > 0) {
      setShares(shares - 1);
      setBalance(balance + stock.price);
    }
  };

  const simulateMarketChange = () => {
    const change = (Math.random() - 0.5) * 10;
    const newPrice = Math.max(stock.price + change, 1);
    setStock({
      ...stock,
      price: Number(newPrice.toFixed(2)),
      trend: change > 0 ? "up" : "down",
      change: Number(change.toFixed(2)),
    });
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 md:relative md:bottom-auto bg-white/80 backdrop-blur p-4 md:p-6 border-t md:border md:rounded-xl border-gray-200 shadow-sm z-40">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold">Trading Simulator</h3>
          <p className="text-sm md:text-base text-gray-600">Practice trading in a risk-free environment</p>
        </div>
        <Button onClick={simulateMarketChange} variant="outline" size="sm">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Simulate Market Change
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-6">
        <div className="p-2 md:p-4 bg-gray-50 rounded-lg">
          <div className="text-xs md:text-sm text-gray-600">Your Balance</div>
          <div className="text-lg md:text-2xl font-bold">${balance.toFixed(2)}</div>
        </div>
        
        <div className="p-2 md:p-4 bg-gray-50 rounded-lg">
          <div className="text-xs md:text-sm text-gray-600">{stock.name}</div>
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-lg md:text-2xl font-bold">${stock.price}</span>
            <span className={`flex items-center ${stock.trend === "up" ? "text-success" : "text-red-500"}`}>
              {stock.trend === "up" ? (
                <ArrowUp className="w-3 h-3 md:w-4 md:h-4" />
              ) : (
                <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
              )}
              <span className="text-xs md:text-sm">{Math.abs(stock.change)}</span>
            </span>
          </div>
        </div>

        <div className="p-2 md:p-4 bg-gray-50 rounded-lg">
          <div className="text-xs md:text-sm text-gray-600">Your Shares</div>
          <div className="text-lg md:text-2xl font-bold">{shares}</div>
        </div>
      </div>

      <div className="flex gap-2 md:gap-4">
        <Button onClick={buyShares} className="flex-1 text-sm md:text-base py-2" disabled={balance < stock.price}>
          Buy Share
        </Button>
        <Button onClick={sellShares} variant="outline" className="flex-1 text-sm md:text-base py-2" disabled={shares === 0}>
          Sell Share
        </Button>
      </div>
    </div>
  );
};
