import * as React from "react"
import { Trophy, Medal, Award, Flame, Info } from "lucide-react"
import PageContainer from "@/components/ui/page-container"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { generateMockLeaderboardData, getLevelInfo } from "@/lib/leaderboard"
import { type LeaderboardScope, type LeaderboardTimeframe } from "@/types/leaderboard"
import { cn } from "@/lib/utils"

export default function Leaderboard() {
  const [scope, setScope] = React.useState<LeaderboardScope>("global")
  const [timeframe, setTimeframe] = React.useState<LeaderboardTimeframe>("allTime")
  const [showTutorial, setShowTutorial] = React.useState(true)

  const leaderboardData = React.useMemo(
    () => generateMockLeaderboardData(scope, timeframe),
    [scope, timeframe]
  )

  const top3 = leaderboardData.slice(0, 3)
  const rest = leaderboardData.slice(3, 10)

  const userRank = {
    position: 7,
    xp: 4530,
    nextMilestone: {
      xpNeeded: 50,
      playerName: "Player 6"
    }
  }

  return (
    <PageContainer className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600">See how you stack up against other investors</p>
      </div>

      <Tabs defaultValue={scope} onValueChange={(v) => setScope(v as LeaderboardScope)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as LeaderboardTimeframe)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="allTime">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Personal Rank Card */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">
            You're #{userRank.position}!
          </h3>
          <p className="text-muted-foreground">
            {userRank.nextMilestone ? (
              <span>
                {userRank.nextMilestone.xpNeeded} XP to surpass {userRank.nextMilestone.playerName}
              </span>
            ) : (
              "Keep pushing to climb the ranks!"
            )}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{userRank.xp.toLocaleString()} XP</div>
          <div className={cn("text-sm font-medium", getLevelInfo(userRank.xp).color)}>
            {getLevelInfo(userRank.xp).name}
          </div>
        </div>
      </div>

      {/* Top 3 Winners */}
      <div className="flex justify-center items-end gap-4 py-8">
        {/* Second Place */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur border-2 border-gray-200 mb-2 mx-auto overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="2nd Place" className="w-full h-full" />
          </div>
          <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-gray-200 text-center">
            <Medal className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <div className="font-semibold">Sarah K.</div>
            <div className="text-sm text-gray-600">4,890 XP</div>
          </div>
        </div>

        {/* First Place */}
        <div className="text-center -mt-8">
          <div className="w-24 h-24 rounded-full bg-white/80 backdrop-blur border-2 border-primary mb-2 mx-auto overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="1st Place" className="w-full h-full" />
          </div>
          <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-xl text-white text-center">
            <Trophy className="w-8 h-8 mx-auto mb-1" />
            <div className="font-semibold">John D.</div>
            <div className="text-sm opacity-90">5,230 XP</div>
          </div>
        </div>

        {/* Third Place */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur border-2 border-gray-200 mb-2 mx-auto overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" alt="3rd Place" className="w-full h-full" />
          </div>
          <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-gray-200 text-center">
            <Award className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <div className="font-semibold">Emma R.</div>
            <div className="text-sm text-gray-600">4,550 XP</div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-4">
          {rest.map((entry) => (
            <LeaderboardItem key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      {/* Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to the Leaderboard! 🏆</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Here's how to climb the ranks and earn recognition:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Complete lessons and quizzes to earn XP</li>
              <li>Make smart investment decisions in simulations</li>
              <li>Maintain daily streaks for bonus points</li>
              <li>Earn badges for special achievements</li>
            </ul>
            <Button onClick={() => setShowTutorial(false)} className="w-full">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}

function LeaderboardItem({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="w-8 text-center font-semibold text-gray-600">
        #{entry.position}
      </div>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar className="w-10 h-10 cursor-pointer">
            <AvatarImage src={entry.avatar} alt={entry.name} />
            <AvatarFallback>{entry.name[0]}</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src={entry.avatar} />
              <AvatarFallback>{entry.name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{entry.name}</h4>
              <div className="flex gap-1">
                {entry.badges.map(badge => (
                  <span key={badge.id} title={badge.name}>{badge.icon}</span>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                XP Breakdown: {entry.xpBreakdown.quizzes}% Quizzes, 
                {entry.xpBreakdown.investing}% Investing,
                {entry.xpBreakdown.challenges}% Challenges
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{entry.name}</span>
          {entry.streak > 0 && (
            <div className="flex items-center gap-1 text-orange-500" title={`${entry.streak} day streak`}>
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium">{entry.streak}</span>
            </div>
          )}
          {entry.recentAchievement && (
            <Badge variant="secondary" className="ml-2">
              {entry.recentAchievement}
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-600">
          {entry.xp.toLocaleString()} XP
          <span className={cn("ml-2 font-medium", entry.level.color)}>
            {entry.level.name}
          </span>
        </div>
      </div>

      <Button variant="ghost" size="sm">
        Challenge
      </Button>
    </div>
  );
}
