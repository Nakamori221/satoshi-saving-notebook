/**
 * CoinGecko API integration for BTC price fetching
 * Free tier: No API key required, 10-50 calls/minute
 */

import { CoinGeckoResponse } from '@/types';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// In-memory cache for price data
const priceCache = new Map<string, { price: number; timestamp: number }>();

/**
 * Fetch current BTC price in JPY from CoinGecko
 * @returns BTC price in Japanese Yen
 */
export async function fetchBtcPrice(): Promise<number> {
  const cacheKey = 'btc-jpy-price';
  const cached = priceCache.get(cacheKey);
  
  // Return cached price if within cache duration
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('🟢 CoinGecko: Using cached price', cached.price);
    return cached.price;
  }

  try {
    console.log('🔄 CoinGecko: Fetching new price...');
    
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=bitcoin&vs_currencies=jpy`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data: CoinGeckoResponse = await response.json();
    
    if (!data.bitcoin?.jpy) {
      throw new Error('Invalid response format from CoinGecko API');
    }

    const price = data.bitcoin.jpy;
    
    // Cache the new price
    priceCache.set(cacheKey, { 
      price, 
      timestamp: Date.now() 
    });
    
    console.log('✅ CoinGecko: New price fetched', price);
    return price;
    
  } catch (error) {
    console.error('❌ CoinGecko API error:', error);
    
    // Return cached price if available, even if expired
    if (cached) {
      console.log('⚠️ CoinGecko: Using expired cache due to error', cached.price);
      return cached.price;
    }
    
    // Fallback to a reasonable default price (around 10M JPY)
    const fallbackPrice = 10_000_000;
    console.log('⚠️ CoinGecko: Using fallback price', fallbackPrice);
    return fallbackPrice;
  }
}

/**
 * Get cached BTC price or fetch new one
 * @returns Promise<number> BTC price in JPY
 */
export async function getBtcPrice(): Promise<number> {
  return await fetchBtcPrice();
}

/**
 * Check if price data is cached and fresh
 * @returns boolean indicating if fresh cache is available
 */
export function hasFreshPriceCache(): boolean {
  const cached = priceCache.get('btc-jpy-price');
  return cached ? Date.now() - cached.timestamp < CACHE_DURATION : false;
}

/**
 * Clear price cache (useful for testing or force refresh)
 */
export function clearPriceCache(): void {
  priceCache.clear();
  console.log('🗑️ CoinGecko: Price cache cleared');
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus() {
  const cached = priceCache.get('btc-jpy-price');
  if (!cached) {
    return { status: 'empty', age: 0, price: null };
  }
  
  const age = Date.now() - cached.timestamp;
  const isExpired = age > CACHE_DURATION;
  
  return {
    status: isExpired ? 'expired' : 'fresh',
    age: Math.round(age / 1000), // age in seconds
    price: cached.price,
  };
}