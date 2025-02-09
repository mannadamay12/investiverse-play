import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { type Badge } from "@/types/profile";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BadgeGalleryProps {
  badges: Badge[];
}

export function BadgeGallery({ badges }: BadgeGalleryProps) {
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
      {badges.map((badge) => (
        <HoverCard key={badge.id}>
          <HoverCardTrigger asChild>
            <div
              className={cn(
                "aspect-square rounded-lg p-3 flex items-center justify-center cursor-pointer transition-all",
                badge.earned
                  ? "bg-white/80 hover:bg-white shadow-sm"
                  : "bg-gray-100/50 opacity-50"
              )}
            >
              <div className="text-3xl">{badge.icon}</div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-semibold">{badge.name}</h4>
              <p className="text-sm text-muted-foreground">
                {badge.description}
              </p>
              {badge.progress !== undefined && !badge.earned && (
                <div className="space-y-1">
                  <Progress value={badge.progress} />
                  <p className="text-xs text-muted-foreground">
                    {badge.progress}% Complete
                  </p>
                </div>
              )}
              {badge.earnedAt && (
                <p className="text-xs text-muted-foreground">
                  Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}
