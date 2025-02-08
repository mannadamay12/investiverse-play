import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "./label"

interface QuizProps {
  question: string
  options: string[]
  correctAnswer: number
  onComplete?: (correct: boolean) => void
  className?: string
}

export function Quiz({ question, options, correctAnswer, onComplete, className }: QuizProps) {
  const [selected, setSelected] = React.useState<number | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const isCorrect = selected === correctAnswer

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    onComplete?.(isCorrect)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <p className="font-medium">{question}</p>
      
      <RadioGroup
        value={selected?.toString()}
        onValueChange={(value) => !submitted && setSelected(parseInt(value))}
        className="space-y-2"
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center space-x-2 rounded-lg border p-3 transition-colors",
              submitted && index === correctAnswer && "border-success bg-success/10",
              submitted && selected === index && index !== correctAnswer && "border-destructive bg-destructive/10"
            )}
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
              {option}
            </Label>
            {submitted && index === correctAnswer && (
              <Check className="w-4 h-4 text-success" />
            )}
            {submitted && selected === index && index !== correctAnswer && (
              <X className="w-4 h-4 text-destructive" />
            )}
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={handleSubmit}
        disabled={selected === null || submitted}
        className="w-full"
      >
        Submit Answer
      </Button>
    </div>
  )
}
