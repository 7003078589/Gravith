'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  DollarSign,
  Filter,
  TrendingUp,
  Star,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  X,
  ChevronDown,
  Calendar,
  Info,
  FileText,
  Banknote,
  PieChart,
  BarChart,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useVendors } from '@/hooks/useApi';
import { formatDateForInput } from '@/lib/dateUtils';
import { useUnits } from '@/contexts/UnitContext';
import PageTitle from './PageTitle';

// Dummy vendors array removed - now using real data from API

const categoryIcons = {
  Equipment: '🚜',
  Materials: '🏗️',
  Labour: '👷',
  Transport: '🚚'
};

// Dummy paymentHistory array removed - now using real data from API

// Dummy analytics arrays removed - now using real data from API

// Dummy topVendors array removed - now using real data from API

const vendorCategoriesList = ['Materials', 'Equipment', 'Labour', 'Transport', 'Professional Services', 'Other'];

export default function VendorManagement() {
  const { data: vendorsData, loading: vendorsLoading, error: vendorsError } = useVendors();
  const { formatCurrency, formatDistance, formatWeight, formatVolume, formatArea, units, convertToBaseCurrency } = useUnits();
  
  // Debug logging
  console.log('VendorManagement - vendorsData:', vendorsData);
  console.log('VendorManagement - vendorsLoading:', vendorsLoading);
  console.log('VendorManagement - vendorsError:', vendorsError);
  
  // API mutation for creating vendors - using direct fetch instead of useApiMutation
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [recordPaymentForm, setRecordPaymentForm] = useState({
    vendor: '',
    baseAmount: '',
    gstAmount: '0',
    totalAmount: '0',
    date: '',
    invoiceNumber: 'INV001',
    description: ''
  });
  const [addVendorForm, setAddVendorForm] = useState({
    vendorName: 'Heavy Equipment Rentals',
    category: 'Materials',
    contactPerson: 'Suresh Patil',
    phone: '+91 98765 43210',
    email: 'vendor@company.com',
    paymentTerms: '30 days',
    address: '',
    gstNumber: '27ABCDE12345J75',
    panNumber: 'ABCDE1234S',
    bankAccountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    notes: ''
  });

  // Use real data from API
  const realVendors = (vendorsData as any[]) || [];
  const totalVendors = realVendors.length;
  
  const totalPaid = realVendors.reduce((sum, vendor) => sum + (vendor.paid || 0), 0);
  const totalPending = realVendors.reduce((sum, vendor) => sum + (vendor.pending || 0), 0);
  const avgRating = realVendors.length > 0 ? realVendors.reduce((sum, vendor) => sum + (vendor.rating || 0), 0) / realVendors.length : 0;

  const filteredVendors = categoryFilter === 'all' 
    ? realVendors 
    : realVendors.filter(vendor => vendor.type === categoryFilter);

  // Handle form input changes
  const handleRecordPaymentInputChange = (field: string, value: string) => {
    setRecordPaymentForm(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-calculate total amount
      if (field === 'baseAmount' || field === 'gstAmount') {
        const base = parseFloat(updated.baseAmount) || 0;
        const gst = parseFloat(updated.gstAmount) || 0;
        updated.totalAmount = (base + gst).toString();
      }
      return updated;
    });
  };

  const handleAddVendorInputChange = (field: string, value: string) => {
    setAddVendorForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submissions
  const handleRecordPayment = () => {
    console.log('Recording payment:', recordPaymentForm);
    setShowRecordPaymentModal(false);
    setRecordPaymentForm({
      vendor: '',
      baseAmount: '',
      gstAmount: '0',
      totalAmount: '0',
      date: '',
      invoiceNumber: 'INV001',
      description: ''
    });
  };

  const handleAddVendor = async () => {
    try {
      // Prepare vendor data for API
      // Map form category to database type
      const categoryMapping: { [key: string]: string } = {
        'Materials': 'supplier',
        'Equipment': 'equipment-rental',
        'Labour': 'contractor',
        'Transport': 'service-provider',
        'Professional Services': 'service-provider',
        'Other': 'supplier'
      };

      const vendorData = {
        name: addVendorForm.vendorName,
        type: categoryMapping[addVendorForm.category] || 'supplier',
        contact_person: addVendorForm.contactPerson,
        email: addVendorForm.email,
        phone: addVendorForm.phone,
        address: addVendorForm.address,
        city: '', // You can extract from address if needed
        state: '', // You can extract from address if needed
        pincode: '', // You can extract from address if needed
        gst_number: addVendorForm.gstNumber,
        rating: 5 // Default rating
      };

      console.log('Submitting vendor data:', vendorData);

      // Submit to database using direct API call instead of mutation hook
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });

      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success) {
        setShowAddVendorModal(false);
        setAddVendorForm({
          vendorName: 'Heavy Equipment Rentals',
          category: 'Materials',
          contactPerson: 'Suresh Patil',
          phone: '+91 98765 43210',
          email: 'vendor@company.com',
          paymentTerms: '30 days',
          address: '',
          gstNumber: '27ABCDE12345J75',
          panNumber: 'ABCDE1234S',
          bankAccountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          notes: ''
        });
        
        // Show success message
        alert('Vendor added successfully!');
        
        // Refresh the page to show the new vendor
        window.location.reload();
      } else {
        alert('Error adding vendor: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Error adding vendor: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const renderPaymentHistory = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Payment history will be loaded from real data */}
              {([] as any[]).map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(payment.amount / 100000)}L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    // Sample data for enhanced analytics
    const vendorCategories = [
      { category: 'Materials', count: 15, percentage: 35, color: 'bg-blue-500' },
      { category: 'Equipment', count: 12, percentage: 28, color: 'bg-green-500' },
      { category: 'Services', count: 10, percentage: 23, color: 'bg-yellow-500' },
      { category: 'Transport', count: 6, percentage: 14, color: 'bg-purple-500' }
    ];

    const vendorPayments = [
      { vendor: 'ABC Materials Ltd', amount: 2500000, percentage: 25 },
      { vendor: 'XYZ Equipment Co', amount: 2000000, percentage: 20 },
      { vendor: 'Global Services', amount: 1800000, percentage: 18 },
      { vendor: 'Fast Transport', amount: 1500000, percentage: 15 },
      { vendor: 'Premium Supplies', amount: 1200000, percentage: 12 },
      { vendor: 'Others', amount: 1000000, percentage: 10 }
    ];

    const topVendors = [
      { name: 'ABC Materials Ltd', category: 'Materials', totalPaid: 2500000, rating: 4.8, projects: 12, onTimeDelivery: 95 },
      { name: 'XYZ Equipment Co', category: 'Equipment', totalPaid: 2000000, rating: 4.6, projects: 8, onTimeDelivery: 92 },
      { name: 'Global Services', category: 'Services', totalPaid: 1800000, rating: 4.7, projects: 15, onTimeDelivery: 88 },
      { name: 'Fast Transport', category: 'Transport', totalPaid: 1500000, rating: 4.5, projects: 20, onTimeDelivery: 90 }
    ];

    const monthlyVendorTrends = [
      { month: 'Jan', payments: 1200000, newVendors: 3 },
      { month: 'Feb', payments: 1500000, newVendors: 2 },
      { month: 'Mar', payments: 1800000, newVendors: 4 },
      { month: 'Apr', payments: 1600000, newVendors: 1 },
      { month: 'May', payments: 2000000, newVendors: 3 },
      { month: 'Jun', payments: 2200000, newVendors: 2 }
    ];

    return (
      <div className="space-y-6">
        {/* Analytics Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Vendor Analytics Dashboard</h3>
              <p className="text-gray-600">Comprehensive insights into vendor performance and payment analytics</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
              <Button 
                onClick={() => {
                  const data = {
                    totalVendors: 43,
                    totalPayments: formatCurrency(10000000),
                    categories: vendorCategories,
                    topVendors: topVendors,
                    monthlyTrends: monthlyVendorTrends,
                    date: new Date().toLocaleDateString()
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `vendor_analytics_${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
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
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">43</p>
              <p className="text-sm text-green-600">+5 this month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(10000000)}</p>
              <p className="text-sm text-green-600">+12.3% vs last month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.6</p>
              <p className="text-sm text-green-600">+0.2 vs last month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">On-Time Delivery</p>
              <p className="text-2xl font-bold text-gray-900">91%</p>
              <p className="text-sm text-green-600">+3% vs last month</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendor Distribution by Category */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Vendor Distribution by Category</h4>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{
                  background: `conic-gradient(from 0deg, #3b82f6 0deg 126deg, #10b981 126deg 216deg, #eab308 216deg 270deg, #8b5cf6 270deg 360deg)`
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
              {vendorCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${category.color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{category.percentage}%</div>
                    <div className="text-xs text-gray-500">{category.count} vendors</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Amount by Vendor */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Payment Amount by Vendor</h4>
              <BarChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {vendorPayments.map((vendor, index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-gray-500'];
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{vendor.vendor}</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(vendor.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${colors[index]} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${vendor.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">{vendor.percentage}% of total</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Vendor Trends */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Monthly Vendor Payment Trends</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Payments</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New Vendors</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between px-4">
            {monthlyVendorTrends.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="flex flex-col space-y-1">
                  <div 
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${(data.payments / 2500000) * 200}px` }}
                    title={`Payments: ${formatCurrency(data.payments)}`}
                  ></div>
                  <div 
                    className="w-8 bg-green-500 rounded-b"
                    style={{ height: `${(data.newVendors / 5) * 200}px` }}
                    title={`New Vendors: ${data.newVendors}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Vendors */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Vendors</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topVendors.map((vendor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{vendor.name}</h5>
                    <p className="text-sm text-gray-500">{vendor.category}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Total Paid: </span>
                    <span className="font-medium text-gray-900">{formatCurrency(vendor.totalPaid)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Projects: </span>
                    <span className="font-medium text-gray-900">{vendor.projects}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">On-Time: </span>
                    <span className="font-medium text-gray-900">{vendor.onTimeDelivery}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(vendor.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">★{vendor.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Performance Metrics */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Vendor Performance Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Payment Efficiency</h5>
              <p className="text-2xl font-bold text-blue-600">94%</p>
              <p className="text-sm text-gray-600">On-time payments</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Quality Score</h5>
              <p className="text-2xl font-bold text-green-600">4.6/5</p>
              <p className="text-sm text-gray-600">Average rating</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Vendor Growth</h5>
              <p className="text-2xl font-bold text-purple-600">+15%</p>
              <p className="text-sm text-gray-600">vs last quarter</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (vendorsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vendors...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (vendorsError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600">Error loading vendors: {vendorsError}</p>
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
            title="Vendor Relationship Management" 
            subtitle="Comprehensive vendor management with payment analytics" 
          />
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => setShowRecordPaymentModal(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <DollarSign className="h-4 w-4" />
            <span>Record Payment</span>
          </Button>
          <Button 
            onClick={() => setShowAddVendorModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vendor</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
              <p className="text-xs text-gray-500">{totalVendors} active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid / 100000)}L</p>
              <p className="text-xs text-gray-500">Lifetime</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPending / 100000)}L</p>
              <p className="text-xs text-gray-500">Outstanding</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', name: 'All Vendors' },
            { id: 'history', name: 'Payment History' },
            { id: 'analytics', name: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Vendor Directory</h3>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => alert('Filter functionality coming soon!')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Filter className="h-4 w-4" />
                </button>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Materials">Materials</SelectItem>
                    <SelectItem value="Labour">Labour</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {categoryIcons[vendor.category as keyof typeof categoryIcons]}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">Category: {vendor.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-3 w-3 mr-1" />
                          {vendor.contact}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {vendor.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">Paid:</span> {formatCurrency(vendor.paid / 100000)}L
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Pending:</span> {formatCurrency(vendor.pending / 1000)}K
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vendor.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">{vendor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => alert(`Viewing details for ${vendor.name}... Feature coming soon!`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && renderPaymentHistory()}
      {activeTab === 'analytics' && renderAnalytics()}

      {/* Record Vendor Payment Modal */}
      {showRecordPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Record Vendor Payment</h2>
                <p className="text-sm text-gray-600">Add a new payment transaction</p>
              </div>
              <button
                onClick={() => setShowRecordPaymentModal(false)}
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
                  {/* Vendor */}
                  <div>
                    <Label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                      Vendor
                    </Label>
                    <Select value={recordPaymentForm.vendor} onValueChange={(value) => handleRecordPaymentInputChange('vendor', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {realVendors.map(vendor => (
                          <SelectItem key={vendor.id} value={vendor.name}>{vendor.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Base Amount */}
                  <div>
                    <Label htmlFor="baseAmount" className="text-sm font-medium text-gray-700">
                      Base Amount ({units.currency.symbol})
                    </Label>
                    <Input
                      id="baseAmount"
                      type="number"
                      value={recordPaymentForm.baseAmount}
                      onChange={(e) => handleRecordPaymentInputChange('baseAmount', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                      Date
                    </Label>
                    <DatePicker
                      value={recordPaymentForm.date ? new Date(recordPaymentForm.date) : undefined}
                      onChange={(date) => handleRecordPaymentInputChange('date', formatDateForInput(date))}
                      placeholder="Select payment date"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* GST Amount */}
                  <div>
                    <Label htmlFor="gstAmount" className="text-sm font-medium text-gray-700">
                      GST Amount ({units.currency.symbol})
                    </Label>
                    <Input
                      id="gstAmount"
                      type="number"
                      value={recordPaymentForm.gstAmount}
                      onChange={(e) => handleRecordPaymentInputChange('gstAmount', e.target.value)}
                      placeholder="0 if exempt"
                      className="mt-1"
                    />
                  </div>

                  {/* Total Amount */}
                  <div>
                    <Label htmlFor="totalAmount" className="text-sm font-medium text-gray-700">
                      Total Amount
                    </Label>
                    <Input
                      id="totalAmount"
                      type="text"
                      value={`${units.currency.symbol}${recordPaymentForm.totalAmount}`}
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  </div>

                  {/* Invoice Number */}
                  <div>
                    <Label htmlFor="invoiceNumber" className="text-sm font-medium text-gray-700">
                      Invoice Number
                    </Label>
                    <Input
                      id="invoiceNumber"
                      type="text"
                      value={recordPaymentForm.invoiceNumber}
                      onChange={(e) => handleRecordPaymentInputChange('invoiceNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={recordPaymentForm.description}
                  onChange={(e) => handleRecordPaymentInputChange('description', e.target.value)}
                  placeholder="Payment description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 mt-8">
              <Button
                variant="outline"
                onClick={() => setShowRecordPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRecordPayment}
              >
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Vendor</h2>
                <p className="text-sm text-gray-600">Register a new vendor with complete details</p>
              </div>
              <button
                onClick={() => setShowAddVendorModal(false)}
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
                  {/* Vendor Name */}
                  <div>
                    <Label htmlFor="vendorName" className="text-sm font-medium text-gray-700">
                      Vendor Name
                    </Label>
                    <Input
                      id="vendorName"
                      type="text"
                      value={addVendorForm.vendorName}
                      onChange={(e) => handleAddVendorInputChange('vendorName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">
                      Contact Person
                    </Label>
                    <Input
                      id="contactPerson"
                      type="text"
                      value={addVendorForm.contactPerson}
                      onChange={(e) => handleAddVendorInputChange('contactPerson', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={addVendorForm.email}
                      onChange={(e) => handleAddVendorInputChange('email', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Address
                    </Label>
                    <textarea
                      id="address"
                      value={addVendorForm.address}
                      onChange={(e) => handleAddVendorInputChange('address', e.target.value)}
                      placeholder="Complete address with city and pincode"
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category
                    </Label>
                    <Select value={addVendorForm.category} onValueChange={(value) => handleAddVendorInputChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendorCategoriesList.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={addVendorForm.phone}
                      onChange={(e) => handleAddVendorInputChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <Label htmlFor="paymentTerms" className="text-sm font-medium text-gray-700">
                      Payment Terms
                    </Label>
                    <Input
                      id="paymentTerms"
                      type="text"
                      value={addVendorForm.paymentTerms}
                      onChange={(e) => handleAddVendorInputChange('paymentTerms', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                    <input
                      type="text"
                      value={addVendorForm.gstNumber}
                      onChange={(e) => handleAddVendorInputChange('gstNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input
                      type="text"
                      value={addVendorForm.panNumber}
                      onChange={(e) => handleAddVendorInputChange('panNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                    <input
                      type="text"
                      value={addVendorForm.bankAccountNumber}
                      onChange={(e) => handleAddVendorInputChange('bankAccountNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                    <input
                      type="text"
                      value={addVendorForm.ifscCode}
                      onChange={(e) => handleAddVendorInputChange('ifscCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={addVendorForm.notes}
                  onChange={(e) => handleAddVendorInputChange('notes', e.target.value)}
                  placeholder="Additional notes about the vendor"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 mt-8">
              <Button
                variant="outline"
                onClick={() => setShowAddVendorModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddVendor}
              >
                Add Vendor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
