import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET /api/vehicles - Get all vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    
    let vehicles;
    if (siteId) {
      vehicles = await db.getVehiclesBySite(siteId);
    } else {
      vehicles = await db.getVehicles();
    }
    
    return NextResponse.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const vehicle = await db.createVehicle(body);
    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ success: false, error: 'Failed to create vehicle' }, { status: 500 });
  }
}
