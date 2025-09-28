import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET - Fetch all refueling records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let queryText = `
      SELECT 
        vr.*,
        v.name as vehicle_name,
        v.type as vehicle_type
      FROM vehicle_refueling vr
      JOIN vehicles v ON vr.vehicle_id = v.id
    `;
    
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (vehicleId) {
      paramCount++;
      conditions.push(`vr.vehicle_id = $${paramCount}`);
      params.push(vehicleId);
    }

    if (startDate) {
      paramCount++;
      conditions.push(`vr.refueling_date >= $${paramCount}`);
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      conditions.push(`vr.refueling_date <= $${paramCount}`);
      params.push(endDate);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryText += ` ORDER BY vr.refueling_date DESC, vr.created_at DESC`;

    const result = await query(queryText, params);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching refueling records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refueling records' },
      { status: 500 }
    );
  }
}

// POST - Create new refueling record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicle_id,
      refueling_date,
      mileage,
      fuel_amount,
      fuel_cost,
      fuel_type,
      station_name,
      notes
    } = body;

    // Validate required fields
    if (!vehicle_id || !refueling_date || !mileage || !fuel_amount || !fuel_cost || !station_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const queryText = `
      INSERT INTO vehicle_refueling (
        vehicle_id, refueling_date, mileage, fuel_amount, fuel_cost, 
        fuel_type, station_name, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      vehicle_id,
      refueling_date,
      mileage,
      fuel_amount,
      fuel_cost,
      fuel_type || 'Diesel',
      station_name,
      notes || null
    ];

    const result = await query(queryText, values);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating refueling record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create refueling record' },
      { status: 500 }
    );
  }
}
