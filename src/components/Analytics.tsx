'use client';

import { useState, useEffect } from 'react';
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
  Info,
  Box,
  Wrench,
  HardHat,
  MapPin,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  Legend
} from 'recharts';
import { format, subMonths, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { useUnits } from '@/contexts/UnitContext';
import PageTitle from './PageTitle';

// Sample data for comprehensive analytics
const generateKPIData = () => [
  {
    title: 'Total Revenue',
    value: '₹4.2Cr',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  {
    title: 'Active Projects',
    value: '8',
    change: '+2',
    trend: 'up',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    title: 'Total Expenses',
    value: '₹2.8Cr',
    change: '+8.3%',
    trend: 'up',
    icon: TrendingDown,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200'
  },
  {
    title: 'Net Profit',
    value: '₹1.4Cr',
    change: '+18.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  {
    title: 'Active Workers',
    value: '156',
    change: '+12',
    trend: 'up',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  {
    title: 'Equipment Count',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200'
  }
];

const generateMonthlyTrends = () => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push({
      month: format(date, 'MMM'),
      fullMonth: format(date, 'MMMM yyyy'),
      revenue: Math.floor(Math.random() * 5000000) + 2000000,
      expenses: Math.floor(Math.random() * 3000000) + 1500000,
      profit: Math.floor(Math.random() * 2000000) + 500000,
      materials: Math.floor(Math.random() * 1500000) + 800000,
      labour: Math.floor(Math.random() * 1000000) + 500000,
      equipment: Math.floor(Math.random() * 800000) + 300000
    });
  }
  return months;
};

const generateExpenseCategories = () => [
  { name: 'Materials', amount: '₹1.2Cr', percentage: 42.8, color: '#3B82F6', trend: '+5.2%' },
  { name: 'Labour', amount: '₹85L', percentage: 30.4, color: '#10B981', trend: '+8.1%' },
  { name: 'Equipment', amount: '₹45L', percentage: 16.1, color: '#F59E0B', trend: '+2.3%' },
  { name: 'Transport', amount: '₹20L', percentage: 7.1, color: '#EF4444', trend: '-1.2%' },
  { name: 'Utilities', amount: '₹10L', percentage: 3.6, color: '#8B5CF6', trend: '+0.8%' }
];

const generateProjectPerformance = () => [
  {
    name: 'BRL Tower',
    status: 'On Track',
    progress: 78,
    budget: '₹2.5Cr',
    spent: '₹1.9Cr',
    efficiency: 92,
    safety: 88,
    timeline: 85
  },
  {
    name: 'Ranchi Complex',
    status: 'Ahead',
    progress: 65,
    budget: '₹1.8Cr',
    spent: '₹1.1Cr',
    efficiency: 95,
    safety: 90,
    timeline: 92
  },
  {
    name: 'Test Site Fixed',
    status: 'At Risk',
    progress: 45,
    budget: '₹1.2Cr',
    spent: '₹0.8Cr',
    efficiency: 75,
    safety: 82,
    timeline: 68
  },
  {
    name: 'Greenfield Project',
    status: 'On Track',
    progress: 32,
    budget: '₹3.2Cr',
    spent: '₹1.0Cr',
    efficiency: 88,
    safety: 85,
    timeline: 78
  }
];

const generateSitePerformance = () => [
  { name: 'BRL Tower', efficiency: 92, safety: 88, budget: 85, timeline: 90 },
  { name: 'Ranchi Complex', efficiency: 95, safety: 90, budget: 88, timeline: 92 },
  { name: 'Test Site Fixed', efficiency: 75, safety: 82, budget: 72, timeline: 68 },
  { name: 'Greenfield Project', efficiency: 88, safety: 85, budget: 90, timeline: 78 }
];

const generateAlerts = () => [
  {
    type: 'warning',
    message: 'Budget overrun detected at Test Site Fixed - 15% above allocated budget',
    time: '2 hours ago',
    priority: 'High'
  },
  {
    type: 'info',
    message: 'New equipment delivery scheduled for BRL Tower tomorrow',
    time: '4 hours ago',
    priority: 'Medium'
  },
  {
    type: 'success',
    message: 'Safety inspection completed at Ranchi Complex - All clear',
    time: '6 hours ago',
    priority: 'Low'
  },
  {
    type: 'error',
    message: 'Equipment maintenance overdue for 3 vehicles',
    time: '1 day ago',
    priority: 'High'
  }
];

const generateCostBreakdown = () => [
  { category: 'Materials', amount: 12000000, percentage: 42.8 },
  { category: 'Labour', amount: 8500000, percentage: 30.4 },
  { category: 'Equipment', amount: 4500000, percentage: 16.1 },
  { category: 'Transport', amount: 2000000, percentage: 7.1 },
  { category: 'Utilities', amount: 1000000, percentage: 3.6 }
];

const generateEfficiencyTrends = () => {
  const weeks = [];
  for (let i = 11; i >= 0; i--) {
    const date = subDays(new Date(), i * 7);
    weeks.push({
      week: `Week ${12 - i}`,
      efficiency: Math.floor(Math.random() * 20) + 75,
      productivity: Math.floor(Math.random() * 15) + 80,
      safety: Math.floor(Math.random() * 10) + 85
    });
  }
  return weeks;
};

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedView, setSelectedView] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    kpis: generateKPIData(),
    monthlyTrends: generateMonthlyTrends(),
    expenseCategories: generateExpenseCategories(),
    projectPerformance: generateProjectPerformance(),
    sitePerformance: generateSitePerformance(),
    alerts: generateAlerts(),
    costBreakdown: generateCostBreakdown(),
    efficiencyTrends: generateEfficiencyTrends()
  });

  const { formatCurrency } = useUnits();

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData({
      kpis: generateKPIData(),
      monthlyTrends: generateMonthlyTrends(),
      expenseCategories: generateExpenseCategories(),
      projectPerformance: generateProjectPerformance(),
      sitePerformance: generateSitePerformance(),
      alerts: generateAlerts(),
      costBreakdown: generateCostBreakdown(),
      efficiencyTrends: generateEfficiencyTrends()
    });
    setIsLoading(false);
  };

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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <PageTitle 
            title="Analytics Dashboard" 
            subtitle="Comprehensive insights and performance metrics for your construction business" 
          />
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
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
        {data.kpis.map((kpi, index) => (
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Financial Performance Trend</h3>
              <div className="flex items-center space-x-4">
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
            
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} name="Profit" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Categories & Project Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Categories */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Expense Distribution</h3>
                <PieChartIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <ResponsiveContainer width={200} height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={data.expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="percentage"
                    >
                      {data.expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {data.expenseCategories.map((category, index) => (
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
                <LineChartIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {data.projectPerformance.map((project, index) => (
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

          {/* Efficiency Trends */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Efficiency Trends</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Efficiency</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Productivity</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Safety</span>
                </div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={data.efficiencyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" strokeWidth={2} name="Efficiency" />
                <Line type="monotone" dataKey="productivity" stroke="#10B981" strokeWidth={2} name="Productivity" />
                <Line type="monotone" dataKey="safety" stroke="#8B5CF6" strokeWidth={2} name="Safety" />
              </RechartsLineChart>
            </ResponsiveContainer>
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
                  {data.sitePerformance.map((site, index) => {
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

          {/* Project Cost Breakdown */}
          <div className="chart-card bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="chart-title text-xl font-semibold text-gray-900 mb-6">Project Cost Breakdown</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={data.costBreakdown} layout="horizontal" className="recharts-bar-chart">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Amount']} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </RechartsBarChart>
              </ResponsiveContainer>
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
              <p className="text-3xl font-bold text-green-900 mb-1">₹1.4Cr</p>
              <p className="text-sm text-green-700">+18.2% from last period</p>
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

          {/* Revenue vs Expenses Area Chart */}
          <div className="chart-card bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="chart-title text-xl font-semibold text-gray-900 mb-6">Revenue vs Expenses Trend</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.monthlyTrends} className="recharts-area-chart">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Revenue" />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Expenses" />
              </AreaChart>
              </ResponsiveContainer>
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
              {data.alerts.map((alert, index) => (
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

          {/* Operations Efficiency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-card bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="chart-title text-lg font-semibold text-gray-900 mb-6">Resource Utilization</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={data.monthlyTrends} className="recharts-bar-chart">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]} />
                  <Legend />
                  <Bar dataKey="materials" fill="#3B82F6" name="Materials" />
                  <Bar dataKey="labour" fill="#10B981" name="Labour" />
                  <Bar dataKey="equipment" fill="#F59E0B" name="Equipment" />
                </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Safety Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Safety Score</p>
                      <p className="text-sm text-gray-600">Overall safety rating</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">92%</p>
                    <p className="text-sm text-green-600">+5% this month</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <HardHat className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Incidents</p>
                      <p className="text-sm text-gray-600">Reported this month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">2</p>
                    <p className="text-sm text-blue-600">-1 from last month</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Compliance</p>
                      <p className="text-sm text-gray-600">Regulatory compliance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">98%</p>
                    <p className="text-sm text-purple-600">Fully compliant</p>
                  </div>
                </div>
              </div>
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
                onClick={() => {
                  setShowExportModal(false);
                  alert('Report exported successfully!');
                }}
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