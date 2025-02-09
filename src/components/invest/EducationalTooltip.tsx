import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface EducationalTooltipProps {
  topic: string;
  children: React.ReactNode;
}

const EDUCATIONAL_CONTENT: Record<string, string> = {
  diversification: "Spreading investments across different assets reduces risk",
  "market-order": "A market order is executed immediately at the best available price",
  "limit-order": "A limit order is executed only at your specified price or better",
  watchlist: "Add stocks to your watchlist to track them before investing",
};

export function EducationalTooltip({ topic, children }: EducationalTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1">
            {children}
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{EDUCATIONAL_CONTENT[topic]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
