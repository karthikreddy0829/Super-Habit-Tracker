
export interface Habit {
  id: string;
  name: string;
  // Key format: "MM-YYYY", e.g., "0-2026" for Jan 2026
  completions: Record<string, number[]>; 
  color: string;
  weekendsOff: boolean;
}

export interface HabitStats {
  id: string;
  name: string;
  completionRate: number;
  currentStreak: number;
}
