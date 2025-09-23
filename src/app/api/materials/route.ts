import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET /api/materials - Get all materials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    
    let materials;
    if (siteId) {
      materials = await db.getMaterialsBySite(siteId);
    } else {
      materials = await db.getMaterials();
    }
    
    return NextResponse.json({ success: true, data: materials });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST /api/materials - Create a new material
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const material = await db.createMaterial(body);
    return NextResponse.json({ success: true, data: material });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json({ success: false, error: 'Failed to create material' }, { status: 500 });
  }
}
