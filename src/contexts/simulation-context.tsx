import * as React from "react"

interface SimulationState {
  balance: number
  portfolio: Array<{
    symbol: string
    shares: number
    averagePrice: number
  }>
  completedTutorials: string[]
}

interface SimulationContext {
  state: SimulationState
  showTutorial: (id: string) => void
  completeTutorial: (id: string) => void
  executeTrade: (symbol: string, shares: number, price: number) => void
}

const SimulationContext = React.createContext<SimulationContext | null>(null)

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SimulationState>({
    balance: 10000,
    portfolio: [],
    completedTutorials: []
  })

  const value = React.useMemo(() => ({
    state,
    showTutorial: (id: string) => {
      // Tutorial logic here
    },
    completeTutorial: (id: string) => {
      setState(prev => ({
        ...prev,
        completedTutorials: [...prev.completedTutorials, id]
      }))
    },
    executeTrade: (symbol: string, shares: number, price: number) => {
      setState(prev => ({
        ...prev,
        balance: prev.balance - (shares * price),
        portfolio: [
          ...prev.portfolio,
          { symbol, shares, averagePrice: price }
        ]
      }))
    }
  }), [state])

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  )
}

export { SimulationContext };
