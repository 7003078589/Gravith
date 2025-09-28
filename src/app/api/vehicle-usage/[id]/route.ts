import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET - Fetch single usage record
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const queryText = `
      SELECT 
        vu.*,
        v.name as vehicle_name,
        v.type as vehicle_type
      FROM vehicle_usage vu
      JOIN vehicles v ON vu.vehicle_id = v.id
      WHERE vu.id = $1
    `;

    const result = await query(queryText, [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Usage record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching usage record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch usage record' },
      { status: 500 }
    );
  }
}

// PUT - Update usage record
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
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

    // Validate mileage
    if (end_mileage <= start_mileage) {
      return NextResponse.json(
        { success: false, error: 'End mileage must be greater than start mileage' },
        { status: 400 }
      );
    }

    const queryText = `
      UPDATE vehicle_usage 
      SET 
        usage_date = $1,
        start_mileage = $2,
        end_mileage = $3,
        start_location = $4,
        end_location = $5,
        purpose = $6,
        driver_name = $7,
        fuel_consumed = $8,
        notes = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `;

    const values = [
      usage_date,
      start_mileage,
      end_mileage,
      start_location,
      end_location,
      purpose,
      driver_name,
      fuel_consumed,
      notes,
      params.id
    ];

    const result = await query(queryText, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Usage record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating usage record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update usage record' },
      { status: 500 }
    );
  }
}

// DELETE - Delete usage record
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const queryText = 'DELETE FROM vehicle_usage WHERE id = $1 RETURNING *';
    const result = await query(queryText, [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Usage record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Usage record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting usage record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete usage record' },
      { status: 500 }
    );
  }
}
