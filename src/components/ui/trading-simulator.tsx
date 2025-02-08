import * as React from "react";
import { useState } from "react";
import { ArrowUp, ArrowDown, RefreshCcw } from "lucide-react";
import { Button } from "./button";
import { useSimulation } from "@/contexts/useSimluation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Stock {
  name: string;
  price: number;
  trend: "up" | "down" | "neutral";
  change: number;
}

export function TradingSimulator() {
  const { state, showTutorial, completeTutorial } = useSimulation();
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
    <div className="relative rounded-lg border bg-card p-6">
      <Tooltip open={!state.completedTutorials.includes("basics")}>
        <TooltipTrigger asChild>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Trading Simulator</h3>
                  <p className="text-gray-600">Practice trading in a risk-free environment</p>
                </div>
                <Button onClick={simulateMarketChange} variant="outline" size="sm">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Simulate Market Change
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-gray-600">Your Balance</div>
                  <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-gray-600">{stock.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${stock.price}</span>
                    <span className={`flex items-center ${stock.trend === "up" ? "text-success" : "text-red-500"}`}>
                      {stock.trend === "up" ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      {Math.abs(stock.change)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-gray-600">Your Shares</div>
                  <div className="text-2xl font-bold">{shares}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={buyShares} className="flex-1" disabled={balance < stock.price}>
                  Buy Share
                </Button>
                <Button onClick={sellShares} variant="outline" className="flex-1" disabled={shares === 0}>
                  Sell Share
                </Button>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Try buying 1 share to see how trading works!</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
