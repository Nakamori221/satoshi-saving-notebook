import { NextResponse } from 'next/server';
import { getBtcPrice } from '@/lib/coingecko';

/**
 * API Route for fetching BTC price
 * GET /api/btc-price
 */
export async function GET() {
  try {
    const price = await getBtcPrice();
    
    return NextResponse.json({
      success: true,
      price,
      currency: 'JPY',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('BTC Price API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch BTC price',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}