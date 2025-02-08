import * as React from "react"
import { Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

interface SocialProgressProps {
  peers: Array<{
    id: string
    name: string
    avatar?: string
    progress: number
  }>
}

export function SocialProgress({ peers }: SocialProgressProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {peers.slice(0, 3).map(peer => (
          <Tooltip key={peer.id}>
            <TooltipTrigger asChild>
              <Avatar className="border-2 border-background">
                {peer.avatar ? (
                  <AvatarImage src={peer.avatar} alt={peer.name} />
                ) : (
                  <AvatarFallback>{peer.name[0]}</AvatarFallback>
                )}
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{peer.name} - {peer.progress}% complete</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      {peers.length > 3 && (
        <span className="text-sm text-muted-foreground">
          +{peers.length - 3} more learning
        </span>
      )}
    </div>
  )
}
