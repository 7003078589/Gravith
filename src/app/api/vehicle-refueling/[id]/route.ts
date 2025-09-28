import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET - Fetch single refueling record
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const queryText = `
      SELECT 
        vr.*,
        v.name as vehicle_name,
        v.type as vehicle_type
      FROM vehicle_refueling vr
      JOIN vehicles v ON vr.vehicle_id = v.id
      WHERE vr.id = $1
    `;

    const result = await query(queryText, [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Refueling record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching refueling record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refueling record' },
      { status: 500 }
    );
  }
}

// PUT - Update refueling record
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      refueling_date,
      mileage,
      fuel_amount,
      fuel_cost,
      fuel_type,
      station_name,
      notes
    } = body;

    const queryText = `
      UPDATE vehicle_refueling 
      SET 
        refueling_date = $1,
        mileage = $2,
        fuel_amount = $3,
        fuel_cost = $4,
        fuel_type = $5,
        station_name = $6,
        notes = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      refueling_date,
      mileage,
      fuel_amount,
      fuel_cost,
      fuel_type,
      station_name,
      notes,
      params.id
    ];

    const result = await query(queryText, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Refueling record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating refueling record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update refueling record' },
      { status: 500 }
    );
  }
}

// DELETE - Delete refueling record
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const queryText = 'DELETE FROM vehicle_refueling WHERE id = $1 RETURNING *';
    const result = await query(queryText, [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Refueling record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Refueling record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting refueling record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete refueling record' },
      { status: 500 }
    );
  }
}
