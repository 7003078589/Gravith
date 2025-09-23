import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// POST /api/utils/calculate-rental-cost - Calculate vehicle rental cost
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { perDayCost, perHourCost, startDate, endDate, dieselCostPerLiter } = body;
    
    if (!perDayCost || !perHourCost || !startDate || !endDate || !dieselCostPerLiter) {
      return NextResponse.json({ success: false, error: 'All parameters are required' }, { status: 400 });
    }
    
    const totalCost = await db.calculateVehicleRentalCost(
      perDayCost,
      perHourCost,
      startDate,
      endDate,
      dieselCostPerLiter
    );
    
    return NextResponse.json({ success: true, data: { totalCost } });
  } catch (error) {
    console.error('Error calculating rental cost:', error);
    return NextResponse.json({ success: false, error: 'Failed to calculate rental cost' }, { status: 500 });
  }
}
