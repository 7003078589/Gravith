import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/test-db - Test database connection
export async function GET() {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database connected successfully!',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
