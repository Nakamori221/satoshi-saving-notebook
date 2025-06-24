/**
 * Core calculation functions for Satoshi Saving Notebook
 */

/**
 * Calculate required monthly amount to reach BTC goal
 * @param priceJpy Current BTC price in JPY
 * @param targetBtc Target BTC amount
 * @param currentBtc Current BTC amount
 * @param monthsLeft Months remaining to deadline
 * @returns Required monthly amount in JPY (rounded up)
 */
export function getRequiredMonthlyAmount(
  priceJpy: number,
  targetBtc: number,
  currentBtc: number,
  monthsLeft: number
): number {
  if (monthsLeft <= 0) return 0;
  
  const remainingBtc = targetBtc - currentBtc;
  if (remainingBtc <= 0) return 0;
  
  const totalJpyNeeded = remainingBtc * priceJpy;
  return Math.ceil(totalJpyNeeded / monthsLeft);
}

/**
 * Calculate required weekly amount
 * @param requiredMonthlyAmount Required monthly amount in JPY
 * @returns Required weekly amount in JPY (rounded up)
 */
export function getRequiredWeeklyAmount(requiredMonthlyAmount: number): number {
  return Math.ceil(requiredMonthlyAmount / 4.33); // Average weeks per month
}

/**
 * Calculate achievement rate
 * @param currentBtc Current BTC amount
 * @param targetBtc Target BTC amount
 * @returns Achievement rate as percentage (0-100)
 */
export function getAchievementRate(currentBtc: number, targetBtc: number): number {
  if (targetBtc <= 0) return 0;
  return Math.min((currentBtc / targetBtc) * 100, 100);
}

/**
 * Calculate remaining satoshis
 * @param targetBtc Target BTC amount
 * @param currentBtc Current BTC amount
 * @returns Remaining satoshis
 */
export function getRemainingSats(targetBtc: number, currentBtc: number): number {
  const remainingBtc = Math.max(targetBtc - currentBtc, 0);
  return Math.round(remainingBtc * 100_000_000); // Convert BTC to satoshis
}

/**
 * Calculate estimated completion date
 * @param currentBtc Current BTC amount
 * @param targetBtc Target BTC amount
 * @param monthlyDepositJpy Monthly deposit amount in JPY
 * @param currentPriceJpy Current BTC price in JPY
 * @returns Estimated completion date
 */
export function getEstimatedCompletionDate(
  currentBtc: number,
  targetBtc: number,
  monthlyDepositJpy: number,
  currentPriceJpy: number
): Date {
  if (currentBtc >= targetBtc) return new Date();
  if (monthlyDepositJpy <= 0 || currentPriceJpy <= 0) {
    // Return far future date if no progress possible
    return new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
  }
  
  const remainingBtc = targetBtc - currentBtc;
  const monthlyBtcPurchase = monthlyDepositJpy / currentPriceJpy;
  const monthsNeeded = remainingBtc / monthlyBtcPurchase;
  
  const completionDate = new Date();
  completionDate.setMonth(completionDate.getMonth() + Math.ceil(monthsNeeded));
  
  return completionDate;
}

/**
 * Calculate months between two dates
 * @param startDate Start date
 * @param endDate End date
 * @returns Number of months between dates
 */
export function getMonthsDifference(startDate: Date, endDate: Date): number {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  const dayDiff = endDate.getDate() - startDate.getDate();
  
  let totalMonths = yearDiff * 12 + monthDiff;
  
  // Adjust for partial months
  if (dayDiff > 0) {
    totalMonths += dayDiff / 30; // Approximate days to months
  }
  
  return Math.max(totalMonths, 0);
}

/**
 * Determine badge color based on achievement rate
 * @param achievementRate Achievement rate (0-100)
 * @returns Mantine color string
 */
export function getBadgeColor(achievementRate: number): string {
  if (achievementRate >= 90) return 'green';
  if (achievementRate >= 50) return 'yellow';
  return 'red';
}

/**
 * Format currency amount
 * @param amount Amount in JPY
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format BTC amount
 * @param btc BTC amount
 * @param precision Decimal places
 * @returns Formatted BTC string
 */
export function formatBtc(btc: number, precision: number = 8): string {
  return btc.toFixed(precision);
}

/**
 * Format satoshi amount
 * @param sats Satoshi amount
 * @returns Formatted satoshi string with commas
 */
export function formatSats(sats: number): string {
  return new Intl.NumberFormat('ja-JP').format(sats);
}

/**
 * Calculate previous month required amount for comparison
 * @param priceJpy Current BTC price in JPY
 * @param targetBtc Target BTC amount
 * @param currentBtc Current BTC amount
 * @param monthsLeft Current months remaining
 * @param priceChangePercent Price change from previous period (e.g., -5 for 5% decrease)
 * @returns Previous month required amount and change info
 */
export function getPreviousMonthComparison(
  priceJpy: number,
  targetBtc: number,
  currentBtc: number,
  monthsLeft: number,
  priceChangePercent: number = 0
): {
  previousRequired: number;
  currentRequired: number;
  changePercent: number;
  changeAmount: number;
  isDecrease: boolean;
} {
  const currentRequired = getRequiredMonthlyAmount(priceJpy, targetBtc, currentBtc, monthsLeft);
  const previousPrice = Math.round(priceJpy / (1 + priceChangePercent / 100));
  const previousRequired = getRequiredMonthlyAmount(previousPrice, targetBtc, currentBtc, monthsLeft + 1);
  
  const changeAmount = currentRequired - previousRequired;
  const changePercent = previousRequired > 0 ? (changeAmount / previousRequired) * 100 : 0;
  
  return {
    previousRequired,
    currentRequired,
    changePercent,
    changeAmount,
    isDecrease: changeAmount < 0,
  };
}

/**
 * Get price change badge color
 * @param changePercent Change percentage
 * @returns Mantine color string
 */
export function getPriceChangeBadgeColor(changePercent: number): string {
  if (changePercent > 5) return 'red';
  if (changePercent > 0) return 'orange';
  if (changePercent < -5) return 'green';
  if (changePercent < 0) return 'teal';
  return 'gray';
}

/**
 * Format time remaining with better granularity
 * @param months Total months remaining
 * @returns Formatted time string
 */
export function formatTimeRemaining(months: number): {
  years: number;
  monthsRemainder: number;
  displayText: string;
  urgencyLevel: 'high' | 'medium' | 'low';
} {
  const years = Math.floor(months / 12);
  const monthsRemainder = Math.floor(months % 12);
  
  let displayText = '';
  if (years > 0) {
    displayText = `${years}年${monthsRemainder}ヶ月`;
  } else {
    displayText = `${monthsRemainder}ヶ月`;
  }
  
  let urgencyLevel: 'high' | 'medium' | 'low' = 'low';
  if (months < 6) urgencyLevel = 'high';
  else if (months < 24) urgencyLevel = 'medium';
  
  return {
    years,
    monthsRemainder,
    displayText,
    urgencyLevel,
  };
}