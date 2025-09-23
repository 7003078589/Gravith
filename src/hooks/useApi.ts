import { useState, useEffect } from 'react';
import { apiService, ApiResponse } from '@/lib/api';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        
        if (response.success) {
          setData(response.data || null);
        } else {
          setError(response.error || 'API call failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
}

// Specific hooks for different data types
export function useSites() {
  return useApi(() => apiService.getSites());
}

export function useLabour() {
  return useApi(() => apiService.getLabour());
}

export function useVehicles(siteId?: string) {
  return useApi(() => apiService.getVehicles(siteId), [siteId]);
}

export function useMaterials(siteId?: string) {
  return useApi(() => apiService.getMaterials(siteId), [siteId]);
}

export function useExpenses(siteId?: string) {
  return useApi(() => apiService.getExpenses(siteId), [siteId]);
}

export function useVendors() {
  return useApi(() => apiService.getVendors());
}

export function useDashboard() {
  return useApi(() => apiService.getDashboardData());
}

// Hook for form submissions
export function useApiMutation<T, R>(
  apiCall: (data: T) => Promise<ApiResponse<R>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<R | null>(null);

  const mutate = async (data: T): Promise<ApiResponse<R>> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall(data);
      
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.error || 'API call failed');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, data };
}
