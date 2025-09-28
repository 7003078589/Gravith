import { useState, useEffect } from 'react';

interface VehicleAnalyticsData {
  refuelingRecords: any[];
  usageRecords: any[];
  summary: {
    total_refuels: number;
    total_fuel_consumed: number;
    total_fuel_cost: number;
    avg_cost_per_liter: number;
    first_refuel_date: string;
    last_refuel_date: string;
    total_mileage_covered: number;
    avg_fuel_efficiency: number;
  };
}

interface VehicleAnalyticsParams {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  reportType?: 'fuel-consumption' | 'usage-analysis' | 'mileage-tracking' | 'cost-analysis';
}

export function useVehicleAnalytics(params: VehicleAnalyticsParams) {
  const [data, setData] = useState<VehicleAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!params.vehicleId) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams();
      searchParams.append('vehicleId', params.vehicleId);
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      if (params.reportType) searchParams.append('reportType', params.reportType);
      
      const response = await fetch(`/api/vehicle-analytics?${searchParams.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch vehicle analytics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [params.vehicleId, params.startDate, params.endDate, params.reportType]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics
  };
}
