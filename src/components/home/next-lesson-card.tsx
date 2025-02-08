import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const NextLessonCard = () => {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Understanding ETFs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Learn the basics of Exchange Traded Funds
            </p>
            <Button size="sm">Continue Learning</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
