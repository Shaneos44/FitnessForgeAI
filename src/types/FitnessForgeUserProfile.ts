export interface FitnessForgeUserProfile {
  activePlanId?: string;
  id?: string;
  uid: string;
  displayName?: string;
  email?: string;
  bio?: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced" | "elite";
  goals?: string[];
  height?: number;
  weight?: number;
  birthdate?: Date | { seconds: number; nanoseconds: number };
  sex?: "male" | "female" | "other" | "prefer-not-to-say";
  interests?: string[];
  completedSetup?: boolean;
  streak?: number;
  weeklyGoal?: number;
}
