import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const dynamic = 'force-dynamic';

// GET /api/vendors - Get all vendors
export async function GET() {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        type,
        contact_person,
        phone,
        email,
        address,
        rating,
        status,
        created_at,
        updated_at
      FROM vendors 
      ORDER BY name ASC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch vendors' 
    }, { status: 500 });
  }
}

// POST /api/vendors - Create a new vendor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, contact_person, phone, email, address, rating, status } = body;

    const result = await query(`
      INSERT INTO vendors (name, type, contact_person, phone, email, address, rating, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, type, contact_person, phone, email, address, rating || 5, status || 'active']);

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create vendor' 
    }, { status: 500 });
  }
}
