import { useState, useEffect } from 'react';

interface RefuelingRecord {
  id: number;
  vehicle_id: string;
  refueling_date: string;
  mileage: number;
  fuel_amount: number;
  fuel_cost: number;
  fuel_type: string;
  station_name: string;
  notes?: string;
  vehicle_name?: string;
  vehicle_type?: string;
  created_at: string;
  updated_at: string;
}

interface UsageRecord {
  id: number;
  vehicle_id: string;
  usage_date: string;
  start_mileage: number;
  end_mileage: number;
  distance: number;
  start_location: string;
  end_location: string;
  purpose: string;
  driver_name: string;
  fuel_consumed: number;
  notes?: string;
  vehicle_name?: string;
  vehicle_type?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Hook for refueling records
export function useRefuelingRecords(vehicleId?: string) {
  const [data, setData] = useState<RefuelingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRefuelingRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (vehicleId) params.append('vehicleId', vehicleId);
      
      const response = await fetch(`/api/vehicle-refueling?${params.toString()}`);
      const result: ApiResponse<RefuelingRecord[]> = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch refueling records');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addRefuelingRecord = async (record: Omit<RefuelingRecord, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/vehicle-refueling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      const result: ApiResponse<RefuelingRecord> = await response.json();
      
      if (result.success) {
        setData(prev => [result.data, ...prev]);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to add refueling record');
      }
    } catch (err) {
      throw err;
    }
  };

  const updateRefuelingRecord = async (id: number, record: Partial<RefuelingRecord>) => {
    try {
      const response = await fetch(`/api/vehicle-refueling/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      const result: ApiResponse<RefuelingRecord> = await response.json();
      
      if (result.success) {
        setData(prev => prev.map(item => item.id === id ? result.data : item));
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update refueling record');
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteRefuelingRecord = async (id: number) => {
    try {
      const response = await fetch(`/api/vehicle-refueling/${id}`, {
        method: 'DELETE',
      });
      
      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        setData(prev => prev.filter(item => item.id !== id));
      } else {
        throw new Error(result.error || 'Failed to delete refueling record');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchRefuelingRecords();
  }, [vehicleId]);

  return {
    data,
    loading,
    error,
    refetch: fetchRefuelingRecords,
    addRecord: addRefuelingRecord,
    updateRecord: updateRefuelingRecord,
    deleteRecord: deleteRefuelingRecord,
  };
}

// Hook for usage records
export function useUsageRecords(vehicleId?: string) {
  const [data, setData] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (vehicleId) params.append('vehicleId', vehicleId);
      
      const response = await fetch(`/api/vehicle-usage?${params.toString()}`);
      const result: ApiResponse<UsageRecord[]> = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch usage records');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addUsageRecord = async (record: Omit<UsageRecord, 'id' | 'distance' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/vehicle-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      const result: ApiResponse<UsageRecord> = await response.json();
      
      if (result.success) {
        setData(prev => [result.data, ...prev]);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to add usage record');
      }
    } catch (err) {
      throw err;
    }
  };

  const updateUsageRecord = async (id: number, record: Partial<UsageRecord>) => {
    try {
      const response = await fetch(`/api/vehicle-usage/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      const result: ApiResponse<UsageRecord> = await response.json();
      
      if (result.success) {
        setData(prev => prev.map(item => item.id === id ? result.data : item));
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update usage record');
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteUsageRecord = async (id: number) => {
    try {
      const response = await fetch(`/api/vehicle-usage/${id}`, {
        method: 'DELETE',
      });
      
      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        setData(prev => prev.filter(item => item.id !== id));
      } else {
        throw new Error(result.error || 'Failed to delete usage record');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchUsageRecords();
  }, [vehicleId]);

  return {
    data,
    loading,
    error,
    refetch: fetchUsageRecords,
    addRecord: addUsageRecord,
    updateRecord: updateUsageRecord,
    deleteRecord: deleteUsageRecord,
  };
}
