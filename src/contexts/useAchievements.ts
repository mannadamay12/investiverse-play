import React from 'react';
import { AchievementContext } from './achievement-context';

export function useAchievements() {
  const context = React.useContext(AchievementContext);
  if (!context) throw new Error("useAchievements must be used within AchievementProvider");
  return context;
}