'use client';

import { useState } from 'react';
import { 
  Building2, 
  Truck, 
  Leaf, 
  DollarSign, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Info,
  Box,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  MapPin,
  Target
} from 'lucide-react';
import { useDashboard, useSites } from '@/hooks/useApi';
import { useUnits } from '@/contexts/UnitContext';
import UnitConversionDemo from './UnitConversionDemo';
import LivePriceTracker from './LivePriceTracker';

export default function DashboardOverview() {
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboard();
  const { data: sites, loading: sitesLoading, error: sitesError } = useSites();
  const { formatCurrency, formatDistance, formatWeight, formatVolume, formatArea, units } = useUnits();
  const [selectedSite, setSelectedSite] = useState('');

  // Calculate overview data from real database
  const stats = (dashboardData as any)?.data?.stats;
  const sitesData = (sites as any[]) || [];

  // Debug logging
  console.log('Dashboard Data:', dashboardData);
  console.log('Sites Data:', sites);
  console.log('Stats:', stats);
  console.log('Dashboard Loading:', dashboardLoading);
  console.log('Dashboard Error:', dashboardError);

  const overviewCards = [
    {
      title: 'Active Sites',
      value: dashboardLoading ? '...' : (stats?.active_sites || sitesData.filter(site => site.status === 'active').length || 0),
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      title: 'Vehicles',
      value: dashboardLoading ? '...' : (stats?.active_vehicles || '0'),
      icon: Truck,
      color: 'bg-green-500'
    },
    {
      title: 'Total Budget',
      value: dashboardLoading ? '...' : `${formatCurrency((stats?.total_budget || 0) / 10000000)}Cr`,
      icon: Leaf,
      color: 'bg-emerald-500'
    },
    {
      title: 'Total Spent',
      value: dashboardLoading ? '...' : `${formatCurrency((stats?.total_spent || 0) / 100000)}L`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Active Vendors',
      value: dashboardLoading ? '...' : (stats?.active_vendors || '8'),
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Completion Rate',
      value: dashboardLoading ? '...' : (stats?.completion_rate || '78%'),
      icon: TrendingUp,
      color: 'bg-indigo-500'
    }
  ];

  const activeSites = [
    {
      name: 'Residential Complex A',
      location: 'Bangalore North',
      progress: 65,
      status: 'On Track',
      statusColor: 'text-green-600',
      nextMilestone: 'Foundation Completion',
      budget: '₹32.5L / ₹50.0L',
      dueDate: '15/02/2024',
      budgetUsed: 65
    },
    {
      name: 'Commercial Plaza B',
      location: 'Electronic City',
      progress: 45,
      status: 'Delayed',
      statusColor: 'text-red-600',
      nextMilestone: 'Structural Work',
      budget: '₹42.0L / ₹80.0L',
      dueDate: '20/02/2024',
      budgetUsed: 53
    },
    {
      name: 'Highway Bridge Project',
      location: 'NH-44 Stretch',
      progress: 80,
      status: 'Ahead',
      statusColor: 'text-blue-600',
      nextMilestone: 'Final Inspection',
      budget: '₹88.0L / ₹120.0L',
      dueDate: '10/02/2024',
      budgetUsed: 73
    }
  ];

  const alerts = [
    {
      type: 'Low Stock Alert',
      message: 'Cement running low at Residential Complex A - Only 45 bags remaining.',
      action: 'Order Now',
      icon: AlertTriangle,
      color: 'text-orange-500'
    },
    {
      type: 'Vehicle Maintenance Due',
      message: '2 vehicles due for scheduled maintenance this week.',
      action: 'Schedule',
      icon: Truck,
      color: 'text-blue-500'
    },
    {
      type: 'Budget Performance',
      message: 'Highway Bridge Project is 12% under budget this month.',
      action: 'View Details',
      icon: TrendingUp,
      color: 'text-green-500'
    }
  ];

  const recentActivities = [
    {
      action: 'Cement delivery received at Residential Complex A',
      time: '2 hours ago',
      amount: '₹85,000',
      icon: Box,
      color: 'text-blue-500'
    },
    {
      action: 'Labour payment processed for Highway Bridge Project',
      time: '4 hours ago',
      amount: '₹125,000',
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      action: 'Vehicle KA-01-AB-1234 maintenance completed',
      time: '6 hours ago',
      amount: '₹15,000',
      icon: Truck,
      color: 'text-purple-500'
    }
  ];

  const quickActions = [
    {
      title: 'Record Expense',
      subtitle: 'Add new expense entry',
      icon: DollarSign,
      color: 'bg-green-500',
      href: '/expenses'
    },
    {
      title: 'Add Material Purchase',
      subtitle: 'Record material procurement',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      href: '/materials'
    },
    {
      title: 'Vehicle Check-in',
      subtitle: 'Update vehicle status',
      icon: Truck,
      color: 'bg-orange-500',
      href: '/vehicles'
    },
    {
      title: 'Site Update',
      subtitle: 'Log site progress',
      icon: MapPin,
      color: 'bg-purple-500',
      href: '/sites'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gavith Construction Pvt. Ltd.</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Welcome to Gavith Build</h2>
        <p className="text-sm sm:text-base text-gray-600">Here's an overview of your construction projects and operations.</p>
      </div>

      {/* Error Display */}
      {(dashboardError || sitesError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Data Loading Error</h3>
              <p className="text-sm text-red-600 mt-1">
                {dashboardError || sitesError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${card.color} mb-3`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Live Price Tracker */}
      <LivePriceTracker />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Construction Sites */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Active Construction Sites</h3>
              <button 
                onClick={() => window.location.href = '/sites'}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {activeSites.map((site, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{site.name}</h4>
                      <p className="text-sm text-gray-600">{site.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${site.statusColor}`}>
                      {site.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{site.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${site.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Next Milestone:</span>
                      <p className="font-medium text-gray-900">{site.nextMilestone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <p className="font-medium text-gray-900">{site.budget}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Due Date:</span>
                      <p className="font-medium text-gray-900">{site.dueDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget Used:</span>
                      <p className="font-medium text-green-600">{site.budgetUsed}% used</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Alerts & Notifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
            </div>
            
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <alert.icon className={`h-5 w-5 ${alert.color} mt-0.5`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{alert.type}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <button 
                        onClick={() => window.alert(`Viewing details for ${alert.type}... Feature coming soon!`)}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {alert.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              </div>
              <button 
                onClick={() => alert('Viewing all recent activities... Feature coming soon!')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <activity.icon className={`h-5 w-5 ${activity.color} mt-0.5`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      <span className="text-sm font-medium text-gray-900">{activity.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <Target className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => window.location.href = action.href}
                  className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
                >
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${action.color} mb-2`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                  <p className="text-xs text-gray-600">{action.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Unit Conversion Demo */}
      <div className="mt-8">
        <UnitConversionDemo />
      </div>
    </div>
  );
}