import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface WatchlistCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  isWatched: boolean;
  onToggleWatch: () => void;
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({
  symbol,
  name,
  price,
  change,
  isWatched,
  onToggleWatch
}) => {
  const changeColor = change >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{symbol}</h3>
          <p className="text-sm text-gray-600">{name}</p>
          <p className="text-sm font-mono mt-1">
            ${price.toFixed(2)}
            <span className={`ml-2 ${changeColor}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleWatch}
          className="mt-1"
        >
          {isWatched ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
};
