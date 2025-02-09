import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WatchlistCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  isWatched: boolean;
  onToggleWatch: () => void;
}

export function WatchlistCard({
  symbol,
  name,
  price,
  change,
  isWatched,
  onToggleWatch,
}: WatchlistCardProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{symbol}</div>
          <div className="text-sm text-muted-foreground">{name}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleWatch}
          className="h-8 w-8 p-0"
        >
          {isWatched ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono">${price.toFixed(2)}</span>
        <span
          className={`flex items-center gap-1 text-sm ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          {change}%
        </span>
      </div>
    </Card>
  );
}
