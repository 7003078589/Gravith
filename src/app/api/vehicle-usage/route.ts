import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET - Fetch all usage records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const driverName = searchParams.get('driverName');

    let queryText = `
      SELECT 
        vu.*,
        v.name as vehicle_name,
        v.type as vehicle_type
      FROM vehicle_usage vu
      JOIN vehicles v ON vu.vehicle_id = v.id
    `;
    
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (vehicleId) {
      paramCount++;
      conditions.push(`vu.vehicle_id = $${paramCount}`);
      params.push(vehicleId);
    }

    if (startDate) {
      paramCount++;
      conditions.push(`vu.usage_date >= $${paramCount}`);
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      conditions.push(`vu.usage_date <= $${paramCount}`);
      params.push(endDate);
    }

    if (driverName) {
      paramCount++;
      conditions.push(`vu.driver_name ILIKE $${paramCount}`);
      params.push(`%${driverName}%`);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryText += ` ORDER BY vu.usage_date DESC, vu.created_at DESC`;

    const result = await query(queryText, params);
    
    // Debug: Log the actual data being returned
    console.log('Vehicle usage records:', result.rows.map(row => ({
      id: row.id,
      start_mileage: row.start_mileage,
      end_mileage: row.end_mileage,
      distance: row.distance,
      start_location: row.start_location,
      end_location: row.end_location
    })));
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching usage records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch usage records' },
      { status: 500 }
    );
  }
}

// POST - Create new usage record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicle_id,
      usage_date,
      start_mileage,
      end_mileage,
      start_location,
      end_location,
      purpose,
      driver_name,
      fuel_consumed,
      notes
    } = body;

    // Debug: Log the incoming data
    console.log('Creating usage record with data:', {
      vehicle_id,
      usage_date,
      start_mileage,
      end_mileage,
      start_location,
      end_location,
      purpose,
      driver_name,
      fuel_consumed,
      notes
    });

    // Validate required fields
    if (!vehicle_id || !usage_date || !start_mileage || !end_mileage || 
        !start_location || !end_location || !purpose || !driver_name || !fuel_consumed) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate mileage - ensure both values are positive and end > start
    if (start_mileage < 0 || end_mileage < 0) {
      return NextResponse.json(
        { success: false, error: 'Mileage values must be positive' },
        { status: 400 }
      );
    }
    
    if (end_mileage <= start_mileage) {
      return NextResponse.json(
        { success: false, error: `End mileage (${end_mileage}) must be greater than start mileage (${start_mileage})` },
        { status: 400 }
      );
    }

    const queryText = `
      INSERT INTO vehicle_usage (
        vehicle_id, usage_date, start_mileage, end_mileage, 
        start_location, end_location, purpose, driver_name, 
        fuel_consumed, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      vehicle_id,
      usage_date,
      start_mileage,
      end_mileage,
      start_location,
      end_location,
      purpose,
      driver_name,
      fuel_consumed,
      notes || null
    ];

    const result = await query(queryText, values);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating usage record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create usage record' },
      { status: 500 }
    );
  }
}
