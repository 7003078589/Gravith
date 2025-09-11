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
  Truck,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  Eye,
  FileText,
  Activity,
  Zap,
  Award,
  Globe,
  Shield,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';

// Sample data for comprehensive analytics
const kpiData = [
  {
    title: 'Total Revenue',
    value: '₹45.2Cr',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    borderColor: 'border-green-200'
  },
  {
    title: 'Total Expenses',
    value: '₹20.9Cr',
    change: '+8.3%',
    trend: 'up',
    icon: TrendingDown,
    color: 'text-red-600',
    bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
    borderColor: 'border-red-200'
  },
  {
    title: 'Active Projects',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    title: 'Fleet Utilization',
    value: '78%',
    change: '+5.2%',
    trend: 'up',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    borderColor: 'border-purple-200'
  },
  {
    title: 'Material Efficiency',
    value: '92%',
    change: '+3.1%',
    trend: 'up',
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
    borderColor: 'border-orange-200'
  },
  {
    title: 'Safety Score',
    value: '98%',
    change: '+1.2%',
    trend: 'up',
    icon: Shield,
    color: 'text-emerald-600',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-200'
  }
];

const projectPerformance = [
  { name: 'Residential Complex A', progress: 85, status: 'On Track', budget: '₹12.5Cr', spent: '₹10.2Cr', timeline: 'Q2 2024' },
  { name: 'Commercial Tower B', progress: 92, status: 'Ahead', budget: '₹18.0Cr', spent: '₹16.5Cr', timeline: 'Q1 2024' },
  { name: 'Infrastructure Project C', progress: 45, status: 'At Risk', budget: '₹25.0Cr', spent: '₹11.8Cr', timeline: 'Q3 2024' },
  { name: 'Industrial Plant D', progress: 78, status: 'On Track', budget: '₹15.5Cr', spent: '₹12.1Cr', timeline: 'Q2 2024' },
  { name: 'Hospital Complex E', progress: 23, status: 'Delayed', budget: '₹22.0Cr', spent: '₹5.1Cr', timeline: 'Q4 2024' }
];

const expenseCategories = [
  { name: 'Labor', value: 45, amount: '₹9.4Cr', color: '#3B82F6', trend: '+5.2%' },
  { name: 'Materials', value: 30, amount: '₹6.3Cr', color: '#10B981', trend: '+2.1%' },
  { name: 'Equipment', value: 15, amount: '₹3.1Cr', color: '#F59E0B', trend: '-1.8%' },
  { name: 'Transport', value: 7, amount: '₹1.5Cr', color: '#8B5CF6', trend: '+3.4%' },
  { name: 'Other', value: 3, amount: '₹0.6Cr', color: '#EF4444', trend: '+0.9%' }
];

const monthlyTrends = [
  { month: 'Jan', revenue: 4200000, expenses: 1800000, profit: 2400000 },
  { month: 'Feb', revenue: 4800000, expenses: 2100000, profit: 2700000 },
  { month: 'Mar', revenue: 5200000, expenses: 2300000, profit: 2900000 },
  { month: 'Apr', revenue: 5800000, expenses: 2500000, profit: 3300000 },
  { month: 'May', revenue: 6200000, expenses: 2700000, profit: 3500000 },
  { month: 'Jun', revenue: 6800000, expenses: 2900000, profit: 3900000 }
];

const sitePerformance = [
  { name: 'Site A - Mumbai', efficiency: 94, safety: 98, budget: 87, timeline: 92 },
  { name: 'Site B - Delhi', efficiency: 89, safety: 95, budget: 91, timeline: 88 },
  { name: 'Site C - Bangalore', efficiency: 92, safety: 97, budget: 85, timeline: 94 },
  { name: 'Site D - Chennai', efficiency: 87, safety: 96, budget: 89, timeline: 86 }
];

const alerts = [
  { type: 'warning', message: 'Material shortage detected at Site A', time: '2 hours ago', priority: 'High' },
  { type: 'info', message: 'Equipment maintenance due for Excavator #3', time: '4 hours ago', priority: 'Medium' },
  { type: 'success', message: 'Project B completed ahead of schedule', time: '1 day ago', priority: 'Low' },
  { type: 'error', message: 'Budget overrun risk at Site C', time: '2 days ago', priority: 'High' }
];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedView, setSelectedView] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'text-green-600 bg-green-100';
      case 'Ahead': return 'text-blue-600 bg-blue-100';
      case 'At Risk': return 'text-yellow-600 bg-yellow-100';
      case 'Delayed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Comprehensive insights and performance metrics for your construction business</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 bg-white text-sm"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule Report</span>
              <span className="sm:hidden">Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2 sm:space-x-8 overflow-x-auto">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'projects', name: 'Project Analytics', icon: Building2 },
            { id: 'financial', name: 'Financial Reports', icon: DollarSign },
            { id: 'operations', name: 'Operations', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                selectedView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`bg-white rounded-xl border-2 ${kpi.borderColor} p-4 shadow-sm hover:shadow-md transition-all duration-200`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              {kpi.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
              <div className="flex items-center space-x-1">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content based on selected view */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Financial Performance Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Financial Performance Trend</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Profit</span>
                </div>
              </div>
            </div>
            
            {/* Custom Bar Chart */}
            <div className="h-80 flex items-end justify-between px-4">
              {monthlyTrends.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="flex flex-col space-y-1">
                    {/* Revenue Bar */}
                    <div 
                      className="w-8 bg-green-500 rounded-t"
                      style={{ height: `${(data.revenue / 7000000) * 200}px` }}
                    ></div>
                    {/* Expenses Bar */}
                    <div 
                      className="w-8 bg-red-500"
                      style={{ height: `${(data.expenses / 7000000) * 200}px` }}
                    ></div>
                    {/* Profit Bar */}
                    <div 
                      className="w-8 bg-blue-500 rounded-b"
                      style={{ height: `${(data.profit / 7000000) * 200}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Categories & Project Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Categories */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Expense Distribution</h3>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>
              
              {/* Pie Chart */}
              <div className="flex items-center justify-center h-48 mb-6">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)'}}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)'}}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-yellow-500" style={{clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%)'}}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-purple-500" style={{clipPath: 'polygon(50% 50%, 0% 50%, 0% 100%)'}}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-red-500" style={{clipPath: 'polygon(50% 50%, 0% 0%, 0% 50%)'}}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-white"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                {expenseCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{category.amount}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        category.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Performance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Project Performance</h3>
                <LineChart className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {projectPerformance.map((project, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Budget: {project.budget}</span>
                        <span>Spent: {project.spent}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'projects' && (
        <div className="space-y-6">
          {/* Site Performance Matrix */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Site Performance Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Site</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Efficiency</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Safety</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Budget</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Timeline</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {sitePerformance.map((site, index) => {
                    const overall = Math.round((site.efficiency + site.safety + site.budget + site.timeline) / 4);
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{site.name}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${site.efficiency}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{site.efficiency}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${site.safety}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{site.safety}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${site.budget}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{site.budget}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${site.timeline}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{site.timeline}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              overall >= 90 ? 'bg-green-500' : overall >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}>
                              {overall}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'financial' && (
        <div className="space-y-6">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Net Profit</h3>
              <p className="text-3xl font-bold text-green-900 mb-1">₹24.3Cr</p>
              <p className="text-sm text-green-700">+15.2% from last period</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">ROI</h3>
              <p className="text-3xl font-bold text-blue-900 mb-1">18.5%</p>
              <p className="text-sm text-blue-700">+2.3% from last period</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Cash Flow</h3>
              <p className="text-3xl font-bold text-purple-900 mb-1">₹8.7Cr</p>
              <p className="text-sm text-purple-700">+12.8% from last period</p>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'operations' && (
        <div className="space-y-6">
          {/* Real-time Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Real-time Alerts & Notifications</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Updates</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">{alert.message}</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">{alert.time}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 p-1 hover:bg-gray-100 rounded">
                    <Eye className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Export Report</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Comprehensive Report</option>
                  <option>Financial Summary</option>
                  <option>Project Performance</option>
                  <option>Operations Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
                    <FileText className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm font-medium">PDF</span>
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
                    <BarChart3 className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm font-medium">Excel</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}