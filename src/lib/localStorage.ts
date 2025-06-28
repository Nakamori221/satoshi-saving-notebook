/**
 * Local Storage utilities for demo mode
 */

import { UserGoal, ProgressEntry } from '@/types';

const STORAGE_KEYS = {
  GOAL: 'satoshi-saving-goal',
  PROGRESS: 'satoshi-saving-progress',
};

// Goal operations
export function saveGoalToLocalStorage(goal: UserGoal): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify({
      ...goal,
      deadline: goal.deadline.toISOString(),
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to save goal to localStorage:', error);
  }
}

export function getGoalFromLocalStorage(): UserGoal | null {
  try {
    const goalString = localStorage.getItem(STORAGE_KEYS.GOAL);
    if (!goalString) return null;
    
    const goalData = JSON.parse(goalString);
    return {
      ...goalData,
      deadline: new Date(goalData.deadline),
      createdAt: new Date(goalData.createdAt),
      updatedAt: new Date(goalData.updatedAt),
    };
  } catch (error) {
    console.error('Failed to load goal from localStorage:', error);
    return null;
  }
}

// Progress operations
export function saveProgressToLocalStorage(entry: ProgressEntry): void {
  try {
    const existingProgress = getProgressFromLocalStorage();
    const newProgress = [
      {
        ...entry,
        createdAt: entry.createdAt.toISOString(),
      },
      ...existingProgress.map(p => ({
        ...p,
        createdAt: typeof p.createdAt === 'string' ? p.createdAt : p.createdAt.toISOString(),
      }))
    ];
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
  }
}

export function getProgressFromLocalStorage(): ProgressEntry[] {
  try {
    const progressString = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!progressString) return [];
    
    const progressData = JSON.parse(progressString);
    return progressData.map((entry: any) => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
    }));
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
    return [];
  }
}

export function calculateCurrentBtcFromLocalStorage(): number {
  try {
    const progress = getProgressFromLocalStorage();
    const goal = getGoalFromLocalStorage();
    
    const startBtc = goal?.startBtc || 0;
    const totalBtcPurchased = progress.reduce((sum, entry) => {
      return sum + (entry.depositJpy / entry.btcPrice);
    }, 0);
    
    return startBtc + totalBtcPurchased;
  } catch (error) {
    console.error('Failed to calculate BTC from localStorage:', error);
    return 0;
  }
} 