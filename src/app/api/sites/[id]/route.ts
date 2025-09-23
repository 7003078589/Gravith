import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET /api/sites/[id] - Get site by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const site = await db.getSiteById(params.id);
    if (!site) {
      return NextResponse.json({ success: false, error: 'Site not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: site });
  } catch (error) {
    console.error('Error fetching site:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch site' }, { status: 500 });
  }
}

// PUT /api/sites/[id] - Update site
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const site = await db.updateSite(params.id, body);
    return NextResponse.json({ success: true, data: site });
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json({ success: false, error: 'Failed to update site' }, { status: 500 });
  }
}
