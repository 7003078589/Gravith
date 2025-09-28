import { NextResponse } from 'next/server';
import pool from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    
    const client = await pool.connect();
    let result;
    
    if (siteId) {
      // Filter labour by site if siteId is provided
      result = await client.query(
        'SELECT * FROM labour WHERE site_id = $1 ORDER BY name ASC',
        [siteId]
      );
    } else {
      // Get all labour if no siteId
      result = await client.query('SELECT * FROM labour ORDER BY name ASC');
    }
    
    client.release();
    return NextResponse.json({ success: true, data: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching labour:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch labour' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, skill, experience_years, wage_per_day, wage_per_hour, phone, address, status } = await request.json();
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO labour (name, skill, experience_years, wage_per_day, wage_per_hour, phone, address, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, skill, experience_years, wage_per_day, wage_per_hour, phone, address, status]
    );
    client.release();
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating labour:', error);
    return NextResponse.json({ success: false, error: 'Failed to create labour' }, { status: 500 });
  }
}
