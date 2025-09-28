import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET - Fetch vehicle analytics and reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const reportType = searchParams.get('reportType') || 'fuel-consumption';

    if (!vehicleId) {
      return NextResponse.json(
        { success: false, error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    let result;

    switch (reportType) {
      case 'fuel-consumption':
        result = await getFuelConsumptionReport(vehicleId, startDate, endDate);
        break;
      case 'usage-analysis':
        result = await getUsageAnalysisReport(vehicleId, startDate, endDate);
        break;
      case 'mileage-tracking':
        result = await getMileageTrackingReport(vehicleId, startDate, endDate);
        break;
      case 'cost-analysis':
        result = await getCostAnalysisReport(vehicleId, startDate, endDate);
        break;
      default:
        result = await getFuelConsumptionReport(vehicleId, startDate, endDate);
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching vehicle analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle analytics' },
      { status: 500 }
    );
  }
}

// Fuel Consumption Report
async function getFuelConsumptionReport(vehicleId: string, startDate?: string, endDate?: string) {
  const dateFilter = startDate && endDate ? 
    `AND vr.refueling_date BETWEEN '${startDate}' AND '${endDate}'` : '';

  // Get refueling records with fuel consumption analysis
  const refuelingQuery = `
    SELECT 
      vr.*,
      v.name as vehicle_name,
      v.type as vehicle_type,
      LAG(vr.mileage) OVER (ORDER BY vr.refueling_date) as previous_mileage,
      vr.mileage - LAG(vr.mileage) OVER (ORDER BY vr.refueling_date) as mileage_between_refuels,
      LAG(vr.fuel_amount) OVER (ORDER BY vr.refueling_date) as previous_fuel_amount,
      CASE 
        WHEN LAG(vr.mileage) OVER (ORDER BY vr.refueling_date) IS NOT NULL 
        THEN (vr.mileage - LAG(vr.mileage) OVER (ORDER BY vr.refueling_date)) / NULLIF(LAG(vr.fuel_amount) OVER (ORDER BY vr.refueling_date), 0)
        ELSE NULL 
      END as fuel_efficiency_km_per_liter
    FROM vehicle_refueling vr
    JOIN vehicles v ON vr.vehicle_id = v.id
    WHERE vr.vehicle_id = $1 ${dateFilter}
    ORDER BY vr.refueling_date ASC
  `;

  // Get usage records for the same period
  const usageQuery = `
    SELECT 
      vu.*,
      v.name as vehicle_name,
      v.type as vehicle_type
    FROM vehicle_usage vu
    JOIN vehicles v ON vu.vehicle_id = v.id
    WHERE vu.vehicle_id = $1 ${dateFilter}
    ORDER BY vu.usage_date ASC
  `;

  // Get summary statistics
  const summaryQuery = `
    SELECT 
      COUNT(*) as total_refuels,
      SUM(fuel_amount) as total_fuel_consumed,
      SUM(fuel_cost) as total_fuel_cost,
      AVG(fuel_cost / NULLIF(fuel_amount, 0)) as avg_cost_per_liter,
      MIN(refueling_date) as first_refuel_date,
      MAX(refueling_date) as last_refuel_date,
      MAX(mileage) - MIN(mileage) as total_mileage_covered,
      CASE 
        WHEN COUNT(*) > 1 THEN 
          (MAX(mileage) - MIN(mileage)) / NULLIF(SUM(fuel_amount), 0)
        ELSE NULL 
      END as avg_fuel_efficiency
    FROM vehicle_refueling
    WHERE vehicle_id = $1 ${dateFilter}
  `;

  const [refuelingResult, usageResult, summaryResult] = await Promise.all([
    query(refuelingQuery, [vehicleId]),
    query(usageQuery, [vehicleId]),
    query(summaryQuery, [vehicleId])
  ]);

  return {
    refuelingRecords: refuelingResult.rows,
    usageRecords: usageResult.rows,
    summary: summaryResult.rows[0]
  };
}

// Usage Analysis Report
async function getUsageAnalysisReport(vehicleId: string, startDate?: string, endDate?: string) {
  const dateFilter = startDate && endDate ? 
    `AND vu.usage_date BETWEEN '${startDate}' AND '${endDate}'` : '';

  const queryText = `
    SELECT 
      vu.*,
      v.name as vehicle_name,
      v.type as vehicle_type,
      vu.distance / NULLIF(vu.fuel_consumed, 0) as fuel_efficiency,
      vu.fuel_consumed * (
        SELECT AVG(fuel_cost / NULLIF(fuel_amount, 0)) 
        FROM vehicle_refueling 
        WHERE vehicle_id = $1 
        AND refueling_date <= vu.usage_date
        ORDER BY refueling_date DESC 
        LIMIT 1
      ) as estimated_fuel_cost
    FROM vehicle_usage vu
    JOIN vehicles v ON vu.vehicle_id = v.id
    WHERE vu.vehicle_id = $1 ${dateFilter}
    ORDER BY vu.usage_date ASC
  `;

  const result = await query(queryText, [vehicleId]);
  return result.rows;
}

// Mileage Tracking Report
async function getMileageTrackingReport(vehicleId: string, startDate?: string, endDate?: string) {
  const dateFilter = startDate && endDate ? 
    `AND refueling_date BETWEEN '${startDate}' AND '${endDate}'` : '';

  const queryText = `
    WITH refueling_with_gaps AS (
      SELECT 
        *,
        LAG(mileage) OVER (ORDER BY refueling_date) as prev_mileage,
        LAG(fuel_amount) OVER (ORDER BY refueling_date) as prev_fuel_amount,
        LAG(refueling_date) OVER (ORDER BY refueling_date) as prev_refuel_date,
        mileage - LAG(mileage) OVER (ORDER BY refueling_date) as mileage_gap,
        (mileage - LAG(mileage) OVER (ORDER BY refueling_date)) / NULLIF(LAG(fuel_amount) OVER (ORDER BY refueling_date), 0) as efficiency
      FROM vehicle_refueling
      WHERE vehicle_id = $1 ${dateFilter}
    )
    SELECT 
      rwg.*,
      v.name as vehicle_name,
      v.type as vehicle_type,
      CASE 
        WHEN rwg.mileage_gap > 0 THEN 'Good Efficiency'
        WHEN rwg.mileage_gap > -100 THEN 'Normal Efficiency'
        ELSE 'Poor Efficiency'
      END as efficiency_status
    FROM refueling_with_gaps rwg
    JOIN vehicles v ON rwg.vehicle_id = v.id
    ORDER BY rwg.refueling_date ASC
  `;

  const result = await query(queryText, [vehicleId]);
  return result.rows;
}

// Cost Analysis Report
async function getCostAnalysisReport(vehicleId: string, startDate?: string, endDate?: string) {
  const dateFilter = startDate && endDate ? 
    `AND refueling_date BETWEEN '${startDate}' AND '${endDate}'` : '';

  const queryText = `
    SELECT 
      DATE_TRUNC('month', refueling_date) as month,
      COUNT(*) as refuel_count,
      SUM(fuel_amount) as total_fuel,
      SUM(fuel_cost) as total_cost,
      AVG(fuel_cost / NULLIF(fuel_amount, 0)) as avg_cost_per_liter,
      MIN(fuel_cost / NULLIF(fuel_amount, 0)) as min_cost_per_liter,
      MAX(fuel_cost / NULLIF(fuel_amount, 0)) as max_cost_per_liter
    FROM vehicle_refueling
    WHERE vehicle_id = $1 ${dateFilter}
    GROUP BY DATE_TRUNC('month', refueling_date)
    ORDER BY month ASC
  `;

  const result = await query(queryText, [vehicleId]);
  return result.rows;
}
