import { NextRequest, NextResponse } from 'next/server';

interface PriceData {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

// Mock pricing data - in production, this would come from external APIs or databases
const mockPricingData: PriceData[] = [
  {
    id: 'cement',
    name: 'Cement (OPC 53)',
    category: 'Materials',
    currentPrice: 420,
    previousPrice: 415,
    change: 5,
    changePercent: 1.2,
    unit: 'per bag',
    lastUpdated: new Date().toISOString(),
    trend: 'up'
  },
  {
    id: 'steel',
    name: 'Steel TMT Bars',
    category: 'Materials',
    currentPrice: 72000,
    previousPrice: 71500,
    change: 500,
    changePercent: 0.7,
    unit: 'per ton',
    lastUpdated: new Date().toISOString(),
    trend: 'up'
  },
  {
    id: 'fuel',
    name: 'Diesel',
    category: 'Fuel',
    currentPrice: 89.5,
    previousPrice: 90.2,
    change: -0.7,
    changePercent: -0.8,
    unit: 'per liter',
    lastUpdated: new Date().toISOString(),
    trend: 'down'
  },
  {
    id: 'labor',
    name: 'Skilled Labor',
    category: 'Labor',
    currentPrice: 850,
    previousPrice: 850,
    change: 0,
    changePercent: 0,
    unit: 'per day',
    lastUpdated: new Date().toISOString(),
    trend: 'stable'
  },
  {
    id: 'sand',
    name: 'River Sand',
    category: 'Materials',
    currentPrice: 45,
    previousPrice: 47,
    change: -2,
    changePercent: -4.3,
    unit: 'per cubic ft',
    lastUpdated: new Date().toISOString(),
    trend: 'down'
  },
  {
    id: 'electricity',
    name: 'Industrial Electricity',
    category: 'Utilities',
    currentPrice: 8.5,
    previousPrice: 8.3,
    change: 0.2,
    changePercent: 2.4,
    unit: 'per kWh',
    lastUpdated: new Date().toISOString(),
    trend: 'up'
  },
  {
    id: 'bricks',
    name: 'Red Bricks',
    category: 'Materials',
    currentPrice: 8.5,
    previousPrice: 8.2,
    change: 0.3,
    changePercent: 3.7,
    unit: 'per piece',
    lastUpdated: new Date().toISOString(),
    trend: 'up'
  },
  {
    id: 'concrete',
    name: 'Ready Mix Concrete',
    category: 'Materials',
    currentPrice: 4200,
    previousPrice: 4150,
    change: 50,
    changePercent: 1.2,
    unit: 'per cubic meter',
    lastUpdated: new Date().toISOString(),
    trend: 'up'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Simulate real-time price fluctuations
    const updatedPrices = mockPricingData.map(price => {
      // Add small random fluctuations to simulate market changes
      const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
      const newPrice = price.currentPrice * (1 + fluctuation);
      const change = newPrice - price.currentPrice;
      const changePercent = (change / price.currentPrice) * 100;
      
      return {
        ...price,
        previousPrice: price.currentPrice,
        currentPrice: Math.round(newPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        trend: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable',
        lastUpdated: new Date().toISOString()
      };
    });

    // Add some delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: updatedPrices,
      lastUpdated: new Date().toISOString(),
      source: 'Market Data API'
    });

  } catch (error) {
    console.error('Error fetching pricing data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch pricing data',
        data: []
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST endpoint for updating prices (admin functionality)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In production, this would update the database
    console.log('Price update request:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Prices updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating prices:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update prices' 
      },
      { status: 500 }
    );
  }
}
