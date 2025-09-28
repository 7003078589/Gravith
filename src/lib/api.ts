// API service layer for frontend components
const API_BASE_URL = ''; // Use relative URLs for same-origin requests

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      // Use absolute URL to avoid redirect issues
      const url = `http://localhost:3000${endpoint}`;
      console.log('Making API request to:', url);
      
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: options?.body,
        cache: 'no-cache', // Prevent caching issues
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Sites API
  async getSites() {
    return this.request('/api/sites');
  }

  async getSiteById(id: string) {
    return this.request(`/api/sites/${id}`);
  }

  async createSite(siteData: any) {
    return this.request('/api/sites', {
      method: 'POST',
      body: JSON.stringify(siteData),
    });
  }

  async updateSite(id: string, siteData: any) {
    return this.request(`/api/sites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(siteData),
    });
  }

  // Vehicles API
  async getVehicles(siteId?: string) {
    const endpoint = siteId ? `/api/vehicles?siteId=${siteId}` : '/api/vehicles';
    return this.request(endpoint);
  }

  async createVehicle(vehicleData: any) {
    return this.request('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  // Materials API
  async getMaterials(siteId?: string) {
    const endpoint = siteId ? `/api/materials?siteId=${siteId}` : '/api/materials';
    return this.request(endpoint);
  }

  async createMaterial(materialData: any) {
    return this.request('/api/materials', {
      method: 'POST',
      body: JSON.stringify(materialData),
    });
  }

  // Expenses API
  async getExpenses(siteId?: string) {
    const endpoint = siteId ? `/api/expenses?siteId=${siteId}` : '/api/expenses';
    return this.request(endpoint);
  }

  async createExpense(expenseData: any) {
    return this.request('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  // Vendors API
  async getVendors() {
    return this.request('/api/vendors');
  }

  async createVendor(vendorData: any) {
    return this.request('/api/vendors', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  }

  // Labour API
  async getLabour(siteId?: string) {
    const url = siteId ? `/api/labour?siteId=${siteId}` : '/api/labour';
    return this.request(url);
  }

  async createLabour(labourData: any) {
    return this.request('/api/labour', {
      method: 'POST',
      body: JSON.stringify(labourData),
    });
  }

  // Dashboard API
  async getDashboardData() {
    return this.request('/api/dashboard');
  }

  // Utility functions for form interconnections
  async getSuggestedMaterials(activityType: string) {
    return this.request(`/api/utils/suggested-materials?activityType=${activityType}`);
  }

  async getSuggestedVehicles(activityType: string) {
    return this.request(`/api/utils/suggested-vehicles?activityType=${activityType}`);
  }

  async getSuggestedSkills(activityType: string) {
    return this.request(`/api/utils/suggested-skills?activityType=${activityType}`);
  }

  async calculateVehicleRentalCost(data: {
    perDayCost: number;
    perHourCost: number;
    startDate: string;
    endDate: string;
    dieselCostPerLiter: number;
  }) {
    return this.request('/api/utils/calculate-rental-cost', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
