import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/sites - Get all sites
export async function GET() {
  try {
    const sites = await db.getSites();
    return NextResponse.json({ success: true, data: sites });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sites' }, { status: 500 });
  }
}

// POST /api/sites - Create a new site
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const site = await db.createSite(body);
    return NextResponse.json({ success: true, data: site });
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json({ success: false, error: 'Failed to create site' }, { status: 500 });
  }
}
