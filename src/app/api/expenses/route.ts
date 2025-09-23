import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET /api/expenses - Get all expenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    
    let expenses;
    if (siteId) {
      expenses = await db.getExpensesBySite(siteId);
    } else {
      expenses = await db.getExpenses();
    }
    
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const expense = await db.createExpense(body);
    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ success: false, error: 'Failed to create expense' }, { status: 500 });
  }
}
