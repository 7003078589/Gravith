'use client';

import { useState } from 'react';
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
  Banknote
} from 'lucide-react';

const vendors = [
  {
    id: 1,
    name: 'Heavy Equipment Rentals',
    category: 'Equipment',
    contact: '+91 98765 43210',
    email: 'suresh@heavyequipment.com',
    paid: 2500000,
    pending: 125000,
    status: 'active',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Tata Steel Limited',
    category: 'Materials',
    contact: '+91 98765 43211',
    email: 'rajesh@tatasteel.com',
    paid: 4500000,
    pending: 325000,
    status: 'active',
    rating: 5.0
  },
  {
    id: 3,
    name: 'Local Contractors Association',
    category: 'Labour',
    contact: '+91 98765 43212',
    email: 'amit@localcontractors.com',
    paid: 1200000,
    pending: 95000,
    status: 'active',
    rating: 4.2
  },
  {
    id: 4,
    name: 'City Transport Services',
    category: 'Transport',
    contact: '+91 98765 43213',
    email: 'prakash@citytransport.com',
    paid: 350000,
    pending: 25000,
    status: 'active',
    rating: 4.0
  }
];

const categoryIcons = {
  Equipment: '🚜',
  Materials: '🏗️',
  Labour: '👷',
  Transport: '🚚'
};

// Payment History Data
const paymentHistory = [
  {
    id: 1,
    date: '2024-01-25',
    vendor: 'Tata Steel Limited',
    amount: 4500000,
    invoiceNumber: 'INV001',
    description: 'Steel materials for foundation work',
    status: 'paid'
  },
  {
    id: 2,
    date: '2024-01-20',
    vendor: 'Heavy Equipment Rentals',
    amount: 2500000,
    invoiceNumber: 'INV002',
    description: 'Excavator rental for 30 days',
    status: 'paid'
  },
  {
    id: 3,
    date: '2024-01-15',
    vendor: 'Local Contractors Association',
    amount: 1200000,
    invoiceNumber: 'INV003',
    description: 'Labor charges for concrete work',
    status: 'paid'
  },
  {
    id: 4,
    date: '2024-01-10',
    vendor: 'City Transport Services',
    amount: 350000,
    invoiceNumber: 'INV004',
    description: 'Material transportation charges',
    status: 'paid'
  }
];

// Vendor Categories for Analytics
const vendorCategories = [
  { name: 'Materials', count: 25, percentage: 25, color: 'bg-blue-500' },
  { name: 'Equipment', count: 25, percentage: 25, color: 'bg-green-500' },
  { name: 'Transport', count: 25, percentage: 25, color: 'bg-orange-500' },
  { name: 'Labour', count: 25, percentage: 25, color: 'bg-yellow-500' }
];

// Payment Amounts by Vendor for Analytics
const paymentAmounts = [
  { vendor: 'Equipment Rentals', amount: 270000 },
  { vendor: 'Steel Limited', amount: 360000 },
  { vendor: 'Contractors Association', amount: 90000 }
];

// Top Performing Vendors
const topVendors = [
  {
    name: 'Tata Steel Limited',
    category: 'Materials',
    totalPaid: 4500000,
    rating: 5.0
  },
  {
    name: 'Heavy Equipment Rentals',
    category: 'Equipment',
    totalPaid: 2500000,
    rating: 4.5
  },
  {
    name: 'Local Contractors Association',
    category: 'Labour',
    totalPaid: 1200000,
    rating: 4.2
  },
  {
    name: 'City Transport Services',
    category: 'Transport',
    totalPaid: 350000,
    rating: 4.0
  }
];

const vendorCategoriesList = ['Materials', 'Equipment', 'Labour', 'Transport', 'Professional Services', 'Other'];

export default function VendorManagement() {
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

  const totalVendors = vendors.length;
  const totalPaid = vendors.reduce((sum, vendor) => sum + vendor.paid, 0);
  const totalPending = vendors.reduce((sum, vendor) => sum + vendor.pending, 0);
  const avgRating = vendors.reduce((sum, vendor) => sum + vendor.rating, 0) / vendors.length;

  const filteredVendors = categoryFilter === 'all' 
    ? vendors 
    : vendors.filter(vendor => vendor.category === categoryFilter);

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

  const handleAddVendor = () => {
    console.log('Adding vendor:', addVendorForm);
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
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{(payment.amount / 100000).toFixed(1)}L
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Vendor Analytics</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Distribution by Category */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Vendor Distribution by Category</h4>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          
          {/* Pie Chart */}
          <div className="flex items-center justify-center h-48 mb-4">
            <div className="text-center">
              {/* Simple Pie Chart using CSS */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)'}}></div>
                <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)'}}></div>
                <div className="absolute inset-0 rounded-full border-8 border-orange-500" style={{clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%)'}}></div>
                <div className="absolute inset-0 rounded-full border-8 border-yellow-500" style={{clipPath: 'polygon(50% 50%, 0% 50%, 0% 100%)'}}></div>
                <div className="absolute inset-0 rounded-full border-8 border-white"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {vendorCategories.map((category) => (
                  <div key={category.name} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                    <span>{category.name} {category.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Amount by Vendor */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Payment Amount by Vendor</h4>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          
          {/* Bar Chart */}
          <div className="h-48">
            <div className="flex items-end justify-between h-full px-4">
              {paymentAmounts.map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="w-12 bg-blue-500 rounded-t" style={{height: `${(item.amount / 360000) * 120}px`}}></div>
                  <span className="text-xs text-gray-600 text-center">{item.vendor}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-4 text-xs text-gray-500">
              <span>₹0 - ₹360,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Vendors */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Top Performing Vendors</h4>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topVendors.map((vendor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
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
                  <span className="font-medium text-gray-900">₹{(vendor.totalPaid / 100000).toFixed(1)}L</span>
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
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Relationship Management</h1>
          <p className="text-gray-600">Comprehensive vendor management with payment analytics</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowRecordPaymentModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DollarSign className="h-4 w-4" />
            <span>Record Payment</span>
          </button>
          <button 
            onClick={() => setShowAddVendorModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vendor</span>
          </button>
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
              <p className="text-2xl font-bold text-gray-900">₹{(totalPaid / 100000).toFixed(1)}L</p>
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
              <p className="text-2xl font-bold text-gray-900">₹{(totalPending / 100000).toFixed(1)}L</p>
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
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Materials">Materials</option>
                    <option value="Labour">Labour</option>
                    <option value="Transport">Transport</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
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
                          <span className="font-medium">Paid:</span> ₹{(vendor.paid / 100000).toFixed(1)}L
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Pending:</span> ₹{(vendor.pending / 1000).toFixed(0)}K
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
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                    <div className="relative">
                      <select
                        value={recordPaymentForm.vendor}
                        onChange={(e) => handleRecordPaymentInputChange('vendor', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 bg-white"
                      >
                        <option value="">Select vendor</option>
                        {vendors.map(vendor => (
                          <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Base Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Amount (₹)</label>
                    <input
                      type="number"
                      value={recordPaymentForm.baseAmount}
                      onChange={(e) => handleRecordPaymentInputChange('baseAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={recordPaymentForm.date}
                        onChange={(e) => handleRecordPaymentInputChange('date', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ colorScheme: 'light' }}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* GST Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Amount (₹)</label>
                    <input
                      type="number"
                      value={recordPaymentForm.gstAmount}
                      onChange={(e) => handleRecordPaymentInputChange('gstAmount', e.target.value)}
                      placeholder="0 if exempt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Total Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                    <input
                      type="text"
                      value={`₹${recordPaymentForm.totalAmount}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>

                  {/* Invoice Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                    <input
                      type="text"
                      value={recordPaymentForm.invoiceNumber}
                      onChange={(e) => handleRecordPaymentInputChange('invoiceNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
              <button
                onClick={() => setShowRecordPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Record Payment
              </button>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                    <input
                      type="text"
                      value={addVendorForm.vendorName}
                      onChange={(e) => handleAddVendorInputChange('vendorName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      value={addVendorForm.contactPerson}
                      onChange={(e) => handleAddVendorInputChange('contactPerson', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={addVendorForm.email}
                      onChange={(e) => handleAddVendorInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={addVendorForm.address}
                      onChange={(e) => handleAddVendorInputChange('address', e.target.value)}
                      placeholder="Complete address with city and pincode"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div className="relative">
                      <select
                        value={addVendorForm.category}
                        onChange={(e) => handleAddVendorInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 bg-white"
                      >
                        {vendorCategoriesList.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={addVendorForm.phone}
                      onChange={(e) => handleAddVendorInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                    <input
                      type="text"
                      value={addVendorForm.paymentTerms}
                      onChange={(e) => handleAddVendorInputChange('paymentTerms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVendor}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
