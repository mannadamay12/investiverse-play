import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuickInvestCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  tag?: string;
  onInvest: (amount: number) => void;
}

export function QuickInvestCard({ 
  symbol, 
  name, 
  price, 
  change,
  tag,
  onInvest 
}: QuickInvestCardProps) {
  const isUp = change >= 0;
  const changeLabel = isUp ? 'up' : 'down';
  const changeColor = isUp ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold">{symbol}</div>
          <div className="text-sm text-muted-foreground">{name}</div>
        </div>
        {tag && (
          <Badge 
            className={`${changeColor} text-white`}
          >
            {changeLabel}
          </Badge>
        )}
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="font-mono font-medium">${price.toFixed(2)}</div>
        <div className={`flex items-center text-sm ${
          isUp ? 'text-green-600' : 'text-red-600'
        }`}>
          {isUp ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onInvest(5)}
        >
          Buy $5
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onInvest(10)}
        >
          Buy $10
        </Button>
      </div>
    </Card>
  );
}
