import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET /api/dashboard - Get dashboard statistics
export async function GET() {
  try {
    const stats = await db.getDashboardStats();
    const siteSummary = await db.getSiteSummary();
    
    return NextResponse.json({ 
      success: true, 
      data: {
        stats,
        sites: siteSummary
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
