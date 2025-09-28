import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// PUT /api/sites/[id] - Update a site
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const siteId = parseInt(params.id);
    const body = await request.json();
    
    const updatedSite = await db.updateSite(siteId.toString(), body);
    return NextResponse.json({ success: true, data: updatedSite });
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json({ success: false, error: 'Failed to update site' }, { status: 500 });
  }
}

// DELETE /api/sites/[id] - Delete a site
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const siteId = parseInt(params.id);
    
    await db.deleteSite(siteId.toString());
    return NextResponse.json({ success: true, message: 'Site deleted successfully' });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete site' }, { status: 500 });
  }
}