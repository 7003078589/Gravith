'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Filter,
  PieChart,
  LineChart,
  DollarSign,
  Users,
  Building2,
  Truck
} from 'lucide-react';

const chartData = {
  expenses: [
    { month: 'Jan', amount: 2500000 },
    { month: 'Feb', amount: 3200000 },
    { month: 'Mar', amount: 2800000 },
    { month: 'Apr', amount: 4100000 },
    { month: 'May', amount: 3800000 },
    { month: 'Jun', amount: 4500000 }
  ],
  revenue: [
    { month: 'Jan', amount: 5000000 },
    { month: 'Feb', amount: 6200000 },
    { month: 'Mar', amount: 5800000 },
    { month: 'Apr', amount: 7100000 },
    { month: 'May', amount: 6800000 },
    { month: 'Jun', amount: 7500000 }
  ],
  categories: [
    { name: 'Labor', value: 45, color: '#3B82F6' },
    { name: 'Materials', value: 30, color: '#10B981' },
    { name: 'Equipment', value: 15, color: '#F59E0B' },
    { name: 'Other', value: 10, color: '#EF4444' }
  ]
};

const kpiData = [
  {
    title: 'Total Revenue',
    value: '₹45.2Cr',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Total Expenses',
    value: '₹20.9Cr',
    change: '+8.3%',
    trend: 'up',
    icon: TrendingDown,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'Active Projects',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Fleet Utilization',
    value: '78%',
    change: '+5.2%',
    trend: 'up',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedChart, setSelectedChart] = useState('revenue');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your construction business performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Calendar className="h-4 w-4" />
            <span>Schedule Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Financial Performance</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="revenue">Revenue</option>
              <option value="expenses">Expenses</option>
              <option value="profit">Profit</option>
            </select>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization would be implemented here</p>
            <p className="text-sm text-gray-400">Using libraries like Recharts or Chart.js</p>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {chartData.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${category.value}%`,
                        backgroundColor: category.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{category.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Project Performance</h3>
            <LineChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">On Schedule</p>
                <p className="text-xs text-green-600">8 projects</p>
              </div>
              <div className="text-2xl font-bold text-green-600">67%</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-900">At Risk</p>
                <p className="text-xs text-yellow-600">3 projects</p>
              </div>
              <div className="text-2xl font-bold text-yellow-600">25%</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-900">Delayed</p>
                <p className="text-xs text-red-600">1 project</p>
              </div>
              <div className="text-2xl font-bold text-red-600">8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Reports</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Financial Report</h4>
            </div>
            <p className="text-sm text-gray-600">Revenue, expenses, and profit analysis</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Project Report</h4>
            </div>
            <p className="text-sm text-gray-600">Project progress and performance metrics</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Vendor Report</h4>
            </div>
            <p className="text-sm text-gray-600">Vendor performance and payment analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}
