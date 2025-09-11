'use client';

import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react';

interface Site {
  id: number;
  name: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  client: string;
  manager: string;
  startDate: string;
  endDate: string;
  priority: string;
}

interface SiteDashboardProps {
  site: Site;
}

export default function SiteDashboard({ site }: SiteDashboardProps) {
  // Mock data for site-specific analytics
  const siteData = {
    vehicles: { total: 3, active: 2, maintenance: 1 },
    materials: { total: 45, lowStock: 3, critical: 1 },
    expenses: { 
      monthly: 850000, 
      labor: 450000, 
      materials: 250000, 
      equipment: 150000 
    },
    timeline: [
      { phase: 'Foundation', status: 'completed', date: '2024-01-15' },
      { phase: 'Structure', status: 'in-progress', date: '2024-02-01' },
      { phase: 'MEP', status: 'pending', date: '2024-03-15' },
      { phase: 'Finishing', status: 'pending', date: '2024-04-01' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Site Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Truck className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Active Vehicles</p>
              <p className="text-2xl font-bold text-blue-900">{siteData.vehicles.active}/{siteData.vehicles.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-orange-600">Materials Stock</p>
              <p className="text-2xl font-bold text-orange-900">{siteData.materials.total} items</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-green-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-green-900">₹{(siteData.expenses.monthly / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown Chart */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expense Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Labor</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '53%' }}></div>
              </div>
              <span className="text-sm text-gray-600">₹{(siteData.expenses.labor / 100000).toFixed(1)}L</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Materials</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '29%' }}></div>
              </div>
              <span className="text-sm text-gray-600">₹{(siteData.expenses.materials / 100000).toFixed(1)}L</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Equipment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
              <span className="text-sm text-gray-600">₹{(siteData.expenses.equipment / 100000).toFixed(1)}L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h3>
        <div className="space-y-4">
          {siteData.timeline.map((phase, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${
                phase.status === 'completed' ? 'bg-green-500' :
                phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{phase.phase}</span>
                  <span className="text-xs text-gray-500">{phase.date}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {phase.status === 'completed' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </span>
                  )}
                  {phase.status === 'in-progress' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </span>
                  )}
                  {phase.status === 'pending' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-900">Site Alerts</p>
            <ul className="text-sm text-red-700 mt-1 space-y-1">
              <li>• Cement stock running low (2 days remaining)</li>
              <li>• Excavator #EX-001 requires maintenance</li>
              <li>• Labor wages payment due tomorrow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
