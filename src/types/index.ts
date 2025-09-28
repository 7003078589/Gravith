export interface Site {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  client: string;
  manager: string;
  description?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'excavator' | 'crane' | 'truck' | 'concrete-mixer' | 'bulldozer';
  status: 'active' | 'maintenance' | 'idle';
  location: string;
  fuelLevel: number;
  lastService: string;
  nextService: string;
  operator: string;
  siteId: string;
}

export interface Material {
  id: string;
  name: string;
  category: 'cement' | 'steel' | 'bricks' | 'sand' | 'aggregate' | 'other';
  quantity: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  siteId: string;
  lastUpdated: string;
  minThreshold: number;
}

export interface Expense {
  id: string;
  description: string;
  category: 'labor' | 'materials' | 'equipment' | 'fuel' | 'utilities' | 'other';
  amount: number;
  date: string;
  siteId: string;
  vendor: string;
  status: 'pending' | 'approved' | 'paid';
}

export interface Payment {
  id: string;
  client: string;
  project: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
  invoiceNumber: string;
  siteId: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'supplier' | 'contractor' | 'service-provider';
  contact: string;
  email: string;
  phone: string;
  rating: number;
  totalOrders: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalSites: number;
  activeSites: number;
  totalBudget: number;
  totalSpent: number;
  pendingPayments: number;
  overduePayments: number;
  activeVehicles: number;
  lowStockMaterials: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}
