'use client';

import { 
  MapPin, 
  Truck, 
  Package, 
  DollarSign, 
  CreditCard, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const stats = [
  {
    title: 'Total Sites',
    value: '12',
    change: '+2 this month',
    icon: MapPin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Active Vehicles',
    value: '8',
    change: '3 in maintenance',
    icon: Truck,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Material Stock',
    value: '156',
    change: '12 low stock',
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Total Expenses',
    value: '₹2.4M',
    change: '+15% this month',
    icon: DollarSign,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'Pending Payments',
    value: '₹850K',
    change: '5 overdue',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Active Vendors',
    value: '24',
    change: '2 new this week',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'site',
    title: 'New site added: Commercial Complex Phase 2',
    time: '2 hours ago',
    icon: MapPin,
    color: 'text-blue-600'
  },
  {
    id: 2,
    type: 'vehicle',
    title: 'Excavator #EX-001 requires maintenance',
    time: '4 hours ago',
    icon: Truck,
    color: 'text-orange-600'
  },
  {
    id: 3,
    type: 'material',
    title: 'Cement stock running low at Site A',
    time: '6 hours ago',
    icon: Package,
    color: 'text-red-600'
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment received from ABC Corp',
    time: '1 day ago',
    icon: CreditCard,
    color: 'text-green-600'
  }
];

const quickActions = [
  { title: 'Add New Site', icon: MapPin, color: 'bg-blue-500' },
  { title: 'Register Vehicle', icon: Truck, color: 'bg-green-500' },
  { title: 'Update Inventory', icon: Package, color: 'bg-orange-500' },
  { title: 'Record Expense', icon: DollarSign, color: 'bg-red-500' },
  { title: 'Track Payment', icon: CreditCard, color: 'bg-purple-500' },
  { title: 'Add Vendor', icon: Users, color: 'bg-indigo-500' }
];

export default function DashboardOverview() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Last updated: 2 minutes ago</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Critical Alerts</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-red-900">Cement stock critically low at Site A</p>
                <p className="text-xs text-red-600">Only 2 days of supply remaining</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-orange-900">Payment overdue from XYZ Corp</p>
                <p className="text-xs text-orange-600">₹150,000 - 5 days overdue</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">All Systems</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Services</span>
              <span className="text-sm font-medium text-green-600">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backup Status</span>
              <span className="text-sm font-medium text-green-600">Up to date</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
