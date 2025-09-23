import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET /api/utils/suggested-materials - Get suggested materials for activity type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activityType = searchParams.get('activityType');
    
    if (!activityType) {
      return NextResponse.json({ success: false, error: 'Activity type is required' }, { status: 400 });
    }
    
    const suggestions = await db.getSuggestedMaterials(activityType);
    return NextResponse.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Error fetching suggested materials:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch suggested materials' }, { status: 500 });
  }
}
