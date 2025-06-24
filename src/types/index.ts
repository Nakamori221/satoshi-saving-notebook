// User Profile Types
export interface UserProfile {
  displayName: string;
  fontScale: number;
  currency: 'JPY';
  salaryDay: number;
  createdAt: Date;
  updatedAt: Date;
}

// Goal Types
export interface UserGoal {
  targetBtc: number;
  deadline: Date;
  startBtc: number;
  createdAt: Date;
  updatedAt: Date;
}

// Reminder Settings Types
export interface ReminderSettings {
  baseDates: number[];
  delayAlert: boolean;
  delayThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

// LINE Token Types
export interface LineToken {
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// BTC Price Cache Types
export interface BtcPriceCache {
  dateISO: string;
  priceJpy: number;
  cachedAt: Date;
}

// Progress Types
export interface ProgressEntry {
  id: string;
  btcPrice: number;
  depositJpy: number;
  memo: string;
  createdAt: Date;
}

// Feedback Types
export interface FeedbackExit {
  q1: number; // 目標達成度 (1-5)
  q2: number; // 使いやすさ (1-5)
  q3: number; // 通知頻度 (1-5)
  q4: number; // 継続阻害要因 (1-5)
  q5: number; // 推奨度 NPS (1-10)
  freeText?: string;
  time: Date;
}

// Example Templates Types
export interface ExampleTemplate {
  title: string;
  targetBtc: number;
  deadline: Date;
  startBtc: number;
  monthlyJpy: number;
}

// Calculation Result Types
export interface CalculationResult {
  requiredMonthlyAmount: number;
  requiredWeeklyAmount: number;
  remainingSats: number;
  achievementRate: number;
  estimatedCompletionDate: Date;
}

// Notification Types
export interface NotificationPayload {
  type: 'daily' | 'achievement' | 'delay';
  userId: string;
  message: string;
  scheduledAt: Date;
}

// API Response Types
export interface CoinGeckoResponse {
  bitcoin: {
    jpy: number;
  };
}

export interface LineNotifyResponse {
  status: number;
  message: string;
}
