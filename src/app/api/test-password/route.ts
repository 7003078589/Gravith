import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST /api/test-password - Test specific database configuration
export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    
    // Create a temporary connection pool with the test configuration
    const testPool = new Pool({
      ...config,
      max: 1, // Single connection for testing
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 3000,
    });

    const client = await testPool.connect();
    
    // Test the connection
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    await testPool.end();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connection successful!',
      timestamp: result.rows[0].current_time
    });
  } catch (error) {
    console.error('Password test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection failed'
    }, { status: 500 });
  }
}
