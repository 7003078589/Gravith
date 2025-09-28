'use client';

import { useState, useEffect } from 'react';
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
  X,
  PieChart,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useExpenses, useSites } from '@/hooks/useApi';
import { formatDateForInput, parseDateFromInput } from '@/lib/dateUtils';
import { useUnits } from '@/contexts/UnitContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageTitle from './PageTitle';

// Dummy expenses array removed - now using real data from API

// Dummy sites array removed - now using real data from API

const statusColors = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800'
};

const categoryIcons = {
  labor: Users,
  materials: Package,
  equipment: Truck,
  fuel: Zap,
  utilities: Zap,
  transport: Truck,
  miscellaneous: FileText
};

export default function ExpenseManagement() {
  const { data: expensesData, loading: expensesLoading, error: expensesError } = useExpenses();
  const { formatCurrency, formatDistance, formatWeight, formatVolume, formatArea, units, convertToBaseCurrency, convertToBaseWeight, convertToBaseVolume, convertToBaseDistance, convertToBaseArea } = useUnits();

  // Helper function to format quantity based on unit type
  const formatExpenseQuantity = (quantity: number, unit: string) => {
    const unitUpper = unit?.toUpperCase() || '';
    
    if (unitUpper.includes('TON') || unitUpper.includes('KG') || unitUpper.includes('GRAM')) {
      return formatWeight(quantity);
    } else if (unitUpper.includes('LITER') || unitUpper.includes('CUBIC') || unitUpper.includes('M3')) {
      return formatVolume(quantity);
    } else if (unitUpper.includes('METER') || unitUpper.includes('KM') || unitUpper.includes('CM')) {
      return formatDistance(quantity);
    } else if (unitUpper.includes('SQUARE') || unitUpper.includes('M2') || unitUpper.includes('ACRE')) {
      return formatArea(quantity);
    } else {
      // For other units like HOURS, DAYS, PIECES, UNIT, etc.
      return `${quantity} ${unit || 'UNIT'}`;
    }
  };

  // Helper function to convert quantity to base units
  const convertQuantityToBase = (quantity: number, unit: string) => {
    const unitUpper = unit?.toUpperCase() || '';
    
    if (unitUpper.includes('TON') || unitUpper.includes('KG') || unitUpper.includes('GRAM')) {
      return convertToBaseWeight(quantity);
    } else if (unitUpper.includes('LITER') || unitUpper.includes('CUBIC') || unitUpper.includes('M3')) {
      return convertToBaseVolume(quantity);
    } else if (unitUpper.includes('METER') || unitUpper.includes('KM') || unitUpper.includes('CM')) {
      return convertToBaseDistance(quantity);
    } else if (unitUpper.includes('SQUARE') || unitUpper.includes('M2') || unitUpper.includes('ACRE')) {
      return convertToBaseArea(quantity);
    } else {
      // For other units like HOURS, DAYS, PIECES, UNIT, etc., return as is
      return quantity;
    }
  };
  
  // API mutation for creating expenses - using direct fetch instead of useApiMutation
  const [activeTab, setActiveTab] = useState('All Expenses');
  const [viewMode, setViewMode] = useState('overall');
  const [selectedSite, setSelectedSite] = useState('All Sites');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({
    site: 'all',
    timePeriod: 'all',
    customStartDate: '',
    customEndDate: '',
    format: 'csv'
  });
  const [expenseForm, setExpenseForm] = useState({
    category: 'labor',
    subcategory: '',
    description: '',
    quantity: '1',
    unit: 'UNIT',
    costPerUnit: '125000',
    amount: '125000',
    date: undefined as Date | undefined,
    vendor: '',
    site: '',
    receiptNumber: 'RCT001',
    approvedBy: ''
  });

  // Use real data from API
  const realExpenses = (expensesData as any[]) || [];
  const sitesData = useSites();
  const realSites = (sitesData?.data as any[]) || [];
  
  // Calculate summary data
  const totalExpenses = realExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  const paidExpenses = realExpenses.filter(e => e.status === 'paid').reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  const pendingExpenses = realExpenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  const overdueExpenses = realExpenses.filter(e => e.status === 'overdue').reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  const paidCount = realExpenses.filter(e => e.status === 'paid').length;
  const pendingCount = realExpenses.filter(e => e.status === 'pending').length;
  const overdueCount = realExpenses.filter(e => e.status === 'overdue').length;

  // Handle form input changes
  const handleFormInputChange = (field: string, value: string | Date | undefined) => {
    setExpenseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportFormChange = (field: string, value: string) => {
    setExportForm(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    console.log('Export button clicked');
    console.log('Export form:', exportForm);
    console.log('Real expenses:', realExpenses);

    // Filter expenses based on export criteria
    let filteredExpenses = [...realExpenses];

    // Filter by site
    if (exportForm.site !== 'all') {
      filteredExpenses = filteredExpenses.filter(expense => expense.site === exportForm.site);
    }

    // Filter by time period
    if (exportForm.timePeriod !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (exportForm.timePeriod) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'yesterday':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          break;
        case 'thisWeek':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
          break;
        case 'lastWeek':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
          break;
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'lastMonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          break;
        case 'thisQuarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'custom':
          if (exportForm.customStartDate && exportForm.customEndDate) {
            const customStart = new Date(exportForm.customStartDate);
            const customEnd = new Date(exportForm.customEndDate);
            filteredExpenses = filteredExpenses.filter(expense => {
              const expenseDate = new Date(expense.date);
              return expenseDate >= customStart && expenseDate <= customEnd;
            });
          }
          break;
        default:
          break;
      }

      if (exportForm.timePeriod !== 'custom') {
        filteredExpenses = filteredExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate;
        });
      }
    }

    console.log('Filtered expenses:', filteredExpenses);

    // Check if there are any expenses to export
    if (filteredExpenses.length === 0) {
      alert('No expenses found matching the selected criteria.');
      return;
    }

    // Generate export data
    const exportData = filteredExpenses.map(expense => ({
      'Date': expense.date,
      'Site': expense.site || 'N/A',
      'Category': expense.category,
      'Description': expense.description,
      'Quantity': expense.quantity,
      'Unit': expense.unit,
      'Cost per Unit': expense.costPerUnit,
      'Total Amount': expense.amount,
      'Vendor': expense.vendor || 'N/A',
      'Receipt Number': expense.receiptNumber || 'N/A',
      'Status': expense.status,
      'Approved By': expense.approvedBy || 'N/A'
    }));

    console.log('Export data:', exportData);

    // Export based on format
    if (exportForm.format === 'csv') {
      exportToCSV(exportData, 'expenses_export.csv');
    } else if (exportForm.format === 'excel') {
      exportToExcel(exportData, 'expenses_export.xlsx');
    }

    setShowExportModal(false);
  };

  const exportToCSV = (data: any[], filename: string) => {
    console.log('Exporting to CSV:', data);
    
    if (!data || data.length === 0) {
      console.error('No data to export');
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0] || {});
    console.log('Headers:', headers);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    console.log('CSV Content:', csvContent);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('CSV export completed');
  };

  const exportToExcel = (data: any[], filename: string) => {
    // For Excel export, we'll use a simple CSV format that Excel can open
    // In a real application, you might want to use a library like xlsx
    exportToCSV(data, filename.replace('.xlsx', '.csv'));
  };

  // Handle form submission
  const handleAddExpense = async () => {
    try {
      // Prepare expense data for API
      const quantity = parseFloat(expenseForm.quantity) || 1;
      const unit = expenseForm.unit;
      
      const expenseData = {
        description: expenseForm.description,
        category: expenseForm.category.toLowerCase(), // Convert to lowercase to match database constraint
        quantity: convertQuantityToBase(quantity, unit), // Convert quantity to base units
        unit: unit,
        cost_per_unit: convertToBaseCurrency(parseFloat(expenseForm.costPerUnit) || 0), // Convert to base currency (INR)
        amount: convertToBaseCurrency(parseFloat(expenseForm.amount) || 0), // Convert to base currency (INR)
        expense_date: expenseForm.date || null,
        site_id: null, // You can map site name to ID if needed
        vendor_id: null, // You can map vendor name to ID if needed
        status: 'pending',
        created_by: null // You can get this from user context
      };

      console.log('Submitting expense data:', expenseData);

      // Submit to database using direct API call instead of mutation hook
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success) {
        setShowAddExpenseModal(false);
        // Reset form
        setExpenseForm({
          category: 'labor',
          subcategory: '',
          description: '',
          quantity: '1',
          unit: 'UNIT',
          costPerUnit: '0',
          amount: '0',
          date: undefined,
          vendor: '',
          site: '',
          receiptNumber: 'RCT001',
          approvedBy: ''
        });
        
        // Show success message
        alert('Expense added successfully!');
        
        // Refresh the page to show the new expense
        window.location.reload();
      } else {
        alert('Error adding expense: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Map tab names to database categories
  const getTabCategory = (tabName: string) => {
    const categoryMap: { [key: string]: string } = {
      'Labour': 'labor',
      'Materials': 'materials', 
      'Equipment': 'equipment',
      'Transport': 'transport',
      'Utilities': 'utilities',
      'Other': 'miscellaneous'
    };
    return categoryMap[tabName] || tabName.toLowerCase();
  };

  // Filter expenses based on active tab
  const getFilteredExpenses = () => {
    let filtered = realExpenses;
    
    if (activeTab !== 'All Expenses') {
      const categoryToFilter = getTabCategory(activeTab);
      filtered = realExpenses.filter(expense => expense.category === categoryToFilter);
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
    const categoryToFilter = getTabCategory(category);
    const categoryExpenses = realExpenses.filter(expense => expense.category === categoryToFilter);
    const total = categoryExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
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
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => setShowExportModal(true)}
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          {/* Site-Based View - Grouped by Site */}
          <div className="space-y-6">
            {Object.entries(expensesBySite).map(([siteName, siteExpenses]) => {
              const totalValue = (siteExpenses as any[]).reduce((sum, expense) => sum + expense.amount, 0);
              const expenseCount = (siteExpenses as any[]).length;

              return (
                <div key={siteName} className="bg-white border border-gray-200 rounded-lg p-6">
                  {/* Site Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <h4 className="text-lg font-semibold text-gray-900">{siteName}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">Total Value {formatCurrency(totalValue)}</div>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight/Quantity Unit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Unit Cost</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(siteExpenses as any[]).map((expense) => {
                          const IconComponent = categoryIcons[expense.category as keyof typeof categoryIcons] || FileText;
                          return (
                            <tr key={expense.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                                <div className="text-sm text-gray-500">{expense.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="h-4 w-4 text-gray-600" />
                                  <span className="text-sm text-gray-900">{expense.category}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatExpenseQuantity(expense.quantity || 1, expense.unit || 'UNIT')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(expense.cost_per_unit || expense.amount)}/{expense.unit || 'UNIT'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(expense.amount)}
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
                  {realSites.map(site => (
                    <SelectItem key={site.id} value={site.name}>{site.name}</SelectItem>
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
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => setShowExportModal(true)}
              >
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight/Quantity Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Unit Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => {
                const IconComponent = categoryIcons[expense.category as keyof typeof categoryIcons] || FileText;
                return (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                      <div className="text-sm text-gray-500">{expense.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatExpenseQuantity(expense.quantity || 1, expense.unit || 'UNIT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(expense.cost_per_unit || expense.amount)}/{expense.unit || 'UNIT'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(expense.amount)}
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
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || FileText;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IconComponent className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">{category} Expenses ({categoryData.count})</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Total: {formatCurrency(categoryData.total)}</div>
            </div>
            <Button 
              onClick={() => {
                setExpenseForm(prev => ({ ...prev, category: getTabCategory(category) }));
                setShowAddExpenseModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {category} Expense
            </Button>
          </div>
        </div>

        {categoryData.count === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <IconComponent className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No {category} Expenses Yet</h4>
            <p className="text-gray-600 mb-6">
              {category === 'Equipment' && 'Track equipment rental, maintenance, fuel, and operational costs.'}
              {category === 'Transport' && 'Record vehicle costs, fuel expenses, driver wages, and logistics.'}
              {category === 'Utilities' && 'Monitor electricity, water, internet, and site facility costs.'}
              {category === 'Other' && 'Add miscellaneous expenses that don\'t fit other categories.'}
            </p>
            <Button 
              onClick={() => {
                setExpenseForm(prev => ({ ...prev, category: getTabCategory(category) }));
                setShowAddExpenseModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First {category} Expense
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.expenses.map((expense) => (
              <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-6 relative">
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[expense.status as keyof typeof statusColors]}`}>
                    {expense.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{expense.description}</h4>
                  <p className="text-sm text-gray-600">{expense.category}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{expense.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vendor:</span>
                    <span className="font-medium text-gray-900">{expense.vendor || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Site:</span>
                    <span className="font-medium text-gray-900">{expense.site || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Receipt:</span>
                    <span className="font-medium text-gray-900">{expense.receiptNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => {
    // Sample data for enhanced analytics
    const monthlyExpenses = [
      { month: 'Jan', amount: 1200000, budget: 1500000 },
      { month: 'Feb', amount: 1350000, budget: 1500000 },
      { month: 'Mar', amount: 1800000, budget: 1500000 },
      { month: 'Apr', amount: 1600000, budget: 1500000 },
      { month: 'May', amount: 1950000, budget: 1500000 },
      { month: 'Jun', amount: 2100000, budget: 1500000 }
    ];

    const categoryBreakdown = [
      { category: 'Labour', amount: 3200000, percentage: 35, color: 'bg-blue-500' },
      { category: 'Materials', amount: 2800000, percentage: 30, color: 'bg-green-500' },
      { category: 'Equipment', amount: 1800000, percentage: 20, color: 'bg-yellow-500' },
      { category: 'Transport', amount: 900000, percentage: 10, color: 'bg-purple-500' },
      { category: 'Utilities', amount: 400000, percentage: 5, color: 'bg-red-500' }
    ];

    return (
      <div className="space-y-6">
        {/* Analytics Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Expense Analytics Dashboard</h3>
              <p className="text-gray-600">Comprehensive insights into project expenses and spending patterns</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
              <Button 
                onClick={() => setShowExportModal(true)}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
              <p className="text-sm text-green-600">+12.5% vs last month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Paid Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(paidExpenses)}</p>
              <p className="text-sm text-green-600">49.3% of total</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingExpenses)}</p>
              <p className="text-sm text-yellow-600">48.5% of total</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(overdueExpenses)}</p>
              <p className="text-sm text-red-600">2.2% of total</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Expense Trends */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Monthly Expense Trends</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Actual</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Budget</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between px-4">
              {monthlyExpenses.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="flex flex-col space-y-1">
                    <div 
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ height: `${(data.amount / 2500000) * 200}px` }}
                      title={`Actual: ${formatCurrency(data.amount)}`}
                    ></div>
                    <div 
                      className="w-8 bg-red-500 rounded-b"
                      style={{ height: `${(data.budget / 2500000) * 200}px` }}
                      title={`Budget: ${formatCurrency(data.budget)}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Expense Category Breakdown</h4>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{
                  background: `conic-gradient(from 0deg, #3b82f6 0deg 126deg, #10b981 126deg 216deg, #eab308 216deg 270deg, #8b5cf6 270deg 320deg, #ef4444 320deg 360deg)`
                }}></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${category.color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{category.percentage}%</div>
                    <div className="text-xs text-gray-500">{formatCurrency(category.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Status Overview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Payment Status Overview</h4>
            <BarChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Paid</h5>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(paidExpenses)}</p>
              <p className="text-sm text-gray-600">{paidCount} items</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Pending</h5>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingExpenses)}</p>
              <p className="text-sm text-gray-600">{pendingCount} items</p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Overdue</h5>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueExpenses)}</p>
              <p className="text-sm text-gray-600">{overdueCount} items</p>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Top Expense Categories</h4>
          <div className="space-y-4">
            {['Labour', 'Materials', 'Equipment', 'Transport', 'Utilities', 'Other'].map((categoryName, index) => {
              const categoryData = getCategoryData(categoryName);
              const IconComponent = categoryIcons[getTabCategory(categoryName) as keyof typeof categoryIcons] || FileText;
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-gray-500'];
              const percentage = (categoryData.total / totalExpenses) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{categoryName}</p>
                      <p className="text-sm text-gray-600">{categoryData.count} expense{categoryData.count > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(categoryData.total)}</p>
                    <p className="text-sm text-gray-600">{percentage.toFixed(1)}% of total</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Expense Activity</h4>
          <div className="space-y-3">
            {realExpenses
              .sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime())
              .slice(0, 8)
              .map((expense) => {
                const IconComponent = categoryIcons[expense.category as keyof typeof categoryIcons] || FileText;
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                        <p className="text-xs text-gray-600">{expense.category} • {expense.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                      <p className="text-xs text-gray-500">{expense.status}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

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

  // Loading state
  if (expensesLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading expenses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (expensesError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600">Error loading expenses: {expensesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <PageTitle 
            title="Expense Management" 
            subtitle="Comprehensive expense tracking with categorized views and analytics" 
          />
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
              <p className="text-xs text-gray-500">{realExpenses?.length || 0} transactions</p>
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
                        {realSites.map(site => (
                          <SelectItem key={site.id} value={site.name}>{site.name}</SelectItem>
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

                {/* Quantity and Per-Unit Cost */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      value={expenseForm.quantity}
                      onChange={(e) => handleFormInputChange('quantity', e.target.value)}
                      placeholder="1.00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
                      Unit
                    </Label>
                    <Select value={expenseForm.unit} onValueChange={(value) => handleFormInputChange('unit', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNIT">UNIT</SelectItem>
                        <SelectItem value="TON">TON</SelectItem>
                        <SelectItem value="KG">KG</SelectItem>
                        <SelectItem value="HOURS">HOURS</SelectItem>
                        <SelectItem value="DAYS">DAYS</SelectItem>
                        <SelectItem value="LITERS">LITERS</SelectItem>
                        <SelectItem value="CUBIC_METERS">CUBIC METERS</SelectItem>
                        <SelectItem value="PIECES">PIECES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="costPerUnit" className="text-sm font-medium text-gray-700">
                      Per Unit Cost ({units.currency.symbol})
                    </Label>
                    <Input
                      id="costPerUnit"
                      type="number"
                      step="0.01"
                      value={expenseForm.costPerUnit}
                      onChange={(e) => handleFormInputChange('costPerUnit', e.target.value)}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                    Total Amount ({units.currency.symbol})
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

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Expenses</DialogTitle>
            <DialogDescription>
              Choose your export options to download expense data
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleExport(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="export-site" className="text-sm font-medium text-gray-700">
                    Site
                  </Label>
                  <Select value={exportForm.site} onValueChange={(value) => handleExportFormChange('site', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      {realSites.map((site) => (
                        <SelectItem key={site.id} value={site.name}>{site.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="export-format" className="text-sm font-medium text-gray-700">
                    Format
                  </Label>
                  <Select value={exportForm.format} onValueChange={(value) => handleExportFormChange('format', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="export-time-period" className="text-sm font-medium text-gray-700">
                    Time Period
                  </Label>
                  <Select value={exportForm.timePeriod} onValueChange={(value) => handleExportFormChange('timePeriod', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="lastWeek">Last Week</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="thisQuarter">This Quarter</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {exportForm.timePeriod === 'custom' && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="custom-start-date" className="text-sm font-medium text-gray-700">
                        Start Date
                      </Label>
                      <DatePicker
                        value={parseDateFromInput(exportForm.customStartDate) || undefined}
                        onChange={(date) => handleExportFormChange('customStartDate', formatDateForInput(date))}
                        placeholder="Select start date"
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-end-date" className="text-sm font-medium text-gray-700">
                        End Date
                      </Label>
                      <DatePicker
                        value={parseDateFromInput(exportForm.customEndDate) || undefined}
                        onChange={(date) => handleExportFormChange('customEndDate', formatDateForInput(date))}
                        placeholder="Select end date"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Export Expenses
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
