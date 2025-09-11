'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const expenses = [
  {
    id: 1,
    description: 'Cement purchase for Site A',
    category: 'materials',
    amount: 125000,
    date: '2024-01-20',
    siteId: 'site-1',
    vendor: 'ACC Limited',
    status: 'approved',
    receipt: 'REC-001'
  },
  {
    id: 2,
    description: 'Labor wages for foundation work',
    category: 'labor',
    amount: 85000,
    date: '2024-01-19',
    siteId: 'site-2',
    vendor: 'Local Contractor',
    status: 'pending',
    receipt: 'REC-002'
  },
  {
    id: 3,
    description: 'Excavator fuel and maintenance',
    category: 'equipment',
    amount: 45000,
    date: '2024-01-18',
    siteId: 'site-1',
    vendor: 'Equipment Services',
    status: 'paid',
    receipt: 'REC-003'
  },
  {
    id: 4,
    description: 'Site electricity bill',
    category: 'utilities',
    amount: 15000,
    date: '2024-01-17',
    siteId: 'site-3',
    vendor: 'State Electricity Board',
    status: 'approved',
    receipt: 'REC-004'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800'
};

const categoryIcons = {
  labor: '👷',
  materials: '🏗️',
  equipment: '🚜',
  fuel: '⛽',
  utilities: '⚡',
  other: '📋'
};

export default function ExpenseManagement() {
  const [selectedExpense, setSelectedExpense] = useState(expenses[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingAmount = expenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);
  const paidAmount = expenses.filter(e => e.status === 'paid').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Track and manage all construction expenses</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{(totalExpenses / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">₹{(pendingAmount / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">₹{(paidAmount / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">₹{(totalExpenses / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Expense List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="labor">Labor</option>
              <option value="materials">Materials</option>
              <option value="equipment">Equipment</option>
              <option value="fuel">Fuel</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Expense Cards */}
          <div className="space-y-2">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                onClick={() => setSelectedExpense(expense)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedExpense.id === expense.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{categoryIcons[expense.category as keyof typeof categoryIcons]}</span>
                      <h3 className="font-medium text-gray-900 text-sm">{expense.description}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{expense.vendor}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[expense.status as keyof typeof statusColors]}`}>
                        {expense.status}
                      </span>
                    </div>
                  </div>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Amount</span>
                    <span className="font-bold">₹{expense.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Details */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{categoryIcons[selectedExpense.category as keyof typeof categoryIcons]}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedExpense.description}</h2>
                  <p className="text-gray-600">{selectedExpense.vendor}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedExpense.status as keyof typeof statusColors]}`}>
                  {selectedExpense.status}
                </span>
              </div>
            </div>

            {/* Expense Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="text-lg font-bold text-gray-900">₹{selectedExpense.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-lg font-bold text-gray-900">{selectedExpense.date}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Site</p>
                    <p className="text-lg font-bold text-gray-900">Site {selectedExpense.siteId.split('-')[1].toUpperCase()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Receipt</p>
                    <p className="text-lg font-bold text-gray-900">{selectedExpense.receipt}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{selectedExpense.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vendor</span>
                    <span className="text-sm font-medium text-gray-900">{selectedExpense.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Receipt Number</span>
                    <span className="text-sm font-medium text-gray-900">{selectedExpense.receipt}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-medium text-gray-900">{selectedExpense.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Site Location</span>
                    <span className="text-sm font-medium text-gray-900">Site {selectedExpense.siteId.split('-')[1].toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`text-sm font-medium ${statusColors[selectedExpense.status as keyof typeof statusColors]}`}>
                      {selectedExpense.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-3">
                {selectedExpense.status === 'pending' && (
                  <>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Reject
                    </button>
                  </>
                )}
                {selectedExpense.status === 'approved' && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Mark as Paid
                  </button>
                )}
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  View Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
