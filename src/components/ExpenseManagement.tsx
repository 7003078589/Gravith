'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  TrendingUp,
  Coins,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  Truck,
  Zap,
  FileText,
  Download,
  ChevronDown,
  Info,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

// Sample expense data matching your design
const expenses = [
  {
    id: 1,
    title: 'Mason Work',
    description: 'Brickwork for ground floor',
    category: 'Labour',
    amount: 125000,
    date: '28/01/2024',
    vendor: 'Local Contractors',
    site: 'Residential Complex A',
    status: 'paid',
    receipt: 'RCT001'
  },
  {
    id: 2,
    title: 'Excavator Rental',
    description: 'Excavator rental for foundation',
    category: 'Equipment',
    amount: 85000,
    date: '30/01/2024',
    vendor: 'Heavy Equipment Rentals',
    site: 'Residential Complex A',
    status: 'paid',
    receipt: 'RCT002'
  },
  {
    id: 3,
    title: 'Steel',
    description: 'Steel bars procurement',
    category: 'Materials',
    amount: 325000,
    date: '10/02/2024',
    vendor: 'Tata Steel',
    site: 'Commercial Plaza B',
    status: 'pending',
    receipt: 'RCT003'
  },
  {
    id: 4,
    title: 'Electrical Work',
    description: 'Electrical wiring installation',
    category: 'Labour',
    amount: 95000,
    date: '15/02/2024',
    vendor: 'Spark Electricals',
    site: 'Commercial Plaza B',
    status: 'paid',
    receipt: 'RCT004'
  },
  {
    id: 5,
    title: 'Material Transport',
    description: 'Cement and steel transport',
    category: 'Transport',
    amount: 25000,
    date: '12/02/2024',
    vendor: 'City Transport',
    site: 'Highway Bridge Project',
    status: 'paid',
    receipt: 'RCT005'
  },
  {
    id: 6,
    title: 'Electricity',
    description: 'Site electricity charges',
    category: 'Utilities',
    amount: 15000,
    date: '20/02/2024',
    vendor: 'MSEB',
    site: 'Residential Complex A',
    status: 'overdue',
    receipt: 'RCT006'
  }
];

const sites = ['Residential Complex A', 'Commercial Plaza B', 'Highway Bridge Project'];

const statusColors = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800'
};

const categoryIcons = {
  Labour: Users,
  Materials: Package,
  Equipment: Truck,
  Transport: Truck,
  Utilities: Zap,
  Other: FileText
};

export default function ExpenseManagement() {
  const [activeTab, setActiveTab] = useState('All Expenses');
  const [viewMode, setViewMode] = useState('overall');
  const [selectedSite, setSelectedSite] = useState('All Sites');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'Labour',
    subcategory: '',
    description: '',
    amount: '125000',
    date: undefined as Date | undefined,
    vendor: '',
    site: '',
    receiptNumber: 'RCT001',
    approvedBy: ''
  });

  // Calculate summary data
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);
  const overdueExpenses = expenses.filter(e => e.status === 'overdue').reduce((sum, expense) => sum + expense.amount, 0);
  const paidCount = expenses.filter(e => e.status === 'paid').length;
  const pendingCount = expenses.filter(e => e.status === 'pending').length;
  const overdueCount = expenses.filter(e => e.status === 'overdue').length;

  // Handle form input changes
  const handleFormInputChange = (field: string, value: string | Date | undefined) => {
    setExpenseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleAddExpense = () => {
    // Here you would typically add the expense to your data
    console.log('Adding expense:', expenseForm);
    setShowAddExpenseModal(false);
    // Reset form
    setExpenseForm({
      category: 'Labour',
      subcategory: '',
      description: '',
      amount: '125000',
      date: undefined,
      vendor: '',
      site: '',
      receiptNumber: 'RCT001',
      approvedBy: ''
    });
  };

  // Filter expenses based on active tab
  const getFilteredExpenses = () => {
    let filtered = expenses;
    
    if (activeTab !== 'All Expenses') {
      filtered = expenses.filter(expense => expense.category === activeTab);
    }
    
    if (viewMode === 'site' && selectedSite !== 'All Sites') {
      filtered = filtered.filter(expense => expense.site === selectedSite);
    }
    
    if (selectedStatus !== 'All Status') {
      filtered = filtered.filter(expense => expense.status === selectedStatus);
    }
    
    return filtered;
  };

  const filteredExpenses = getFilteredExpenses();

  // Get category-specific data
  const getCategoryData = (category: string) => {
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      expenses: categoryExpenses,
      total,
      count: categoryExpenses.length
    };
  };

  const renderAllExpenses = () => {
    if (viewMode === 'site') {
      // Group expenses by site for Site-Based View
      const expensesBySite = filteredExpenses.reduce((acc, expense) => {
        if (!acc[expense.site]) {
          acc[expense.site] = [];
        }
        acc[expense.site].push(expense);
        return acc;
      }, {} as Record<string, typeof filteredExpenses>);

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Expense Records</h3>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('overall')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Overall View
                </button>
                <button
                  onClick={() => setViewMode('site')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white"
                >
                  Site-Based View
                </button>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          {/* Site-Based View - Grouped by Site */}
          <div className="space-y-6">
            {Object.entries(expensesBySite).map(([siteName, siteExpenses]) => {
              const totalValue = siteExpenses.reduce((sum, expense) => sum + expense.amount, 0);
              const expenseCount = siteExpenses.length;

              return (
                <div key={siteName} className="bg-white border border-gray-200 rounded-lg p-6">
                  {/* Site Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <h4 className="text-lg font-semibold text-gray-900">{siteName}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">Total Value ₹{totalValue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Expenses {expenseCount}</div>
                    </div>
                  </div>

                  {/* Site Expenses Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {siteExpenses.map((expense) => {
                          const IconComponent = categoryIcons[expense.category as keyof typeof categoryIcons];
                          return (
                            <tr key={expense.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                                <div className="text-sm text-gray-500">{expense.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="h-4 w-4 text-gray-600" />
                                  <span className="text-sm text-gray-900">{expense.category}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{expense.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {expense.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {expense.vendor}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[expense.status as keyof typeof statusColors]}`}>
                                  {expense.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {expense.receipt}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Overall View - Single table with all expenses
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Expense Records</h3>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('overall')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white"
              >
                Overall View
              </button>
              <button
                onClick={() => setViewMode('site')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Site-Based View
              </button>
            </div>
            <div className="flex space-x-2">
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Sites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Sites">All Sites</SelectItem>
                  {sites.map(site => (
                    <SelectItem key={site} value={site}>{site}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => {
                const IconComponent = categoryIcons[expense.category as keyof typeof categoryIcons];
                return (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                      <div className="text-sm text-gray-500">{expense.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.site}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[expense.status as keyof typeof statusColors]}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.receipt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCategoryView = (category: string) => {
    const categoryData = getCategoryData(category);
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IconComponent className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">{category} Expenses ({categoryData.count})</h3>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Total: ₹{categoryData.total.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.expenses.map((expense) => (
            <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-6 relative">
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[expense.status as keyof typeof statusColors]}`}>
                  {expense.status}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{expense.title}</h4>
                <p className="text-sm text-gray-600">{expense.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-900">₹{expense.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">{expense.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vendor:</span>
                  <span className="font-medium text-gray-900">{expense.vendor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Site:</span>
                  <span className="font-medium text-gray-900">{expense.site}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Receipt:</span>
                  <span className="font-medium text-gray-900">{expense.receipt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Expense Analytics</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status Overview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Payment Status Overview</h4>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Paid</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '49.3%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">₹3.3L</span>
                <span className="text-sm text-gray-600">49.3%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '48.5%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">₹3.3L</span>
                <span className="text-sm text-gray-600">48.5%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Overdue</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '2.2%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">₹0.1L</span>
                <span className="text-sm text-gray-600">2.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Top Categories</h4>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Materials', icon: Package, amount: 325000, items: 1 },
              { name: 'Labour', icon: Users, amount: 220000, items: 2 },
              { name: 'Equipment', icon: Truck, amount: 85000, items: 1 },
              { name: 'Transport', icon: Truck, amount: 25000, items: 1 },
              { name: 'Utilities', icon: Zap, amount: 15000, items: 1 }
            ].map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">₹{(category.amount / 100000).toFixed(1)}L</div>
                    <div className="text-xs text-gray-500">{category.items} item{category.items > 1 ? 's' : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Recent Activity</h4>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {expenses
            .sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime())
            .slice(0, 5)
            .map((expense) => {
              const IconComponent = categoryIcons[expense.category as keyof typeof categoryIcons];
              return (
                <div key={expense.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{expense.title}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">₹{expense.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{expense.date}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'All Expenses':
        return renderAllExpenses();
      case 'Labour':
      case 'Materials':
      case 'Equipment':
      case 'Transport':
      case 'Utilities':
      case 'Other':
        return renderCategoryView(activeTab);
      case 'Analytics':
        return renderAnalytics();
      default:
        return renderAllExpenses();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Comprehensive expense tracking with categorized views and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Record Expense</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{(totalExpenses / 100000).toFixed(1)}L</p>
              <p className="text-xs text-gray-500">{expenses.length} transactions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">₹{(paidExpenses / 100000).toFixed(1)}L</p>
              <p className="text-xs text-gray-500">{Math.round((paidExpenses / totalExpenses) * 100)}% of total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Coins className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">₹{(pendingExpenses / 100000).toFixed(1)}L</p>
              <p className="text-xs text-gray-500">{pendingCount} items</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">₹{(overdueExpenses / 100000).toFixed(1)}L</p>
              <p className="text-xs text-gray-500">{overdueCount} items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['All Expenses', 'Labour', 'Materials', 'Equipment', 'Transport', 'Utilities', 'Other', 'Analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Expense</h2>
                <p className="text-sm text-gray-600">Record a new project expense</p>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category
                    </Label>
                    <Select value={expenseForm.category} onValueChange={(value) => handleFormInputChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Labour">Labour</SelectItem>
                        <SelectItem value="Materials">Materials</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Vendor */}
                  <div>
                    <Label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                      Vendor
                    </Label>
                    <Input
                      id="vendor"
                      type="text"
                      value={expenseForm.vendor}
                      onChange={(e) => handleFormInputChange('vendor', e.target.value)}
                      placeholder="Vendor name"
                      className="mt-1"
                    />
                  </div>

                  {/* Receipt Number */}
                  <div>
                    <Label htmlFor="receiptNumber" className="text-sm font-medium text-gray-700">
                      Receipt Number
                    </Label>
                    <Input
                      id="receiptNumber"
                      type="text"
                      value={expenseForm.receiptNumber}
                      onChange={(e) => handleFormInputChange('receiptNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Subcategory */}
                  <div>
                    <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700">
                      Subcategory
                    </Label>
                    <Input
                      id="subcategory"
                      type="text"
                      value={expenseForm.subcategory}
                      onChange={(e) => handleFormInputChange('subcategory', e.target.value)}
                      placeholder="e.g., Mason Work, Steel, Excavator Rental"
                      className="mt-1"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                      Date
                    </Label>
                    <div className="mt-1">
                      <DatePicker
                        value={expenseForm.date}
                        onChange={(date) => handleFormInputChange('date', date)}
                        placeholder="Select expense date"
                      />
                    </div>
                  </div>

                  {/* Site */}
                  <div>
                    <Label htmlFor="site" className="text-sm font-medium text-gray-700">
                      Site
                    </Label>
                    <Select value={expenseForm.site} onValueChange={(value) => handleFormInputChange('site', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map(site => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Approved By */}
                  <div>
                    <Label htmlFor="approvedBy" className="text-sm font-medium text-gray-700">
                      Approved By
                    </Label>
                    <Input
                      id="approvedBy"
                      type="text"
                      value={expenseForm.approvedBy}
                      onChange={(e) => handleFormInputChange('approvedBy', e.target.value)}
                      placeholder="Project Manager name"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    value={expenseForm.description}
                    onChange={(e) => handleFormInputChange('description', e.target.value)}
                    placeholder="Detailed description of the expense"
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                    Amount (₹)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => handleFormInputChange('amount', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 mt-8">
              <Button
                variant="outline"
                onClick={() => setShowAddExpenseModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddExpense}
              >
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
