'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  FileText,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Info
} from 'lucide-react';

const payments = [
  {
    id: 1,
    client: 'Acme Real Estate Pvt. Ltd.',
    project: 'Green Valley Apartments',
    contractValue: 50000000,
    amountPaid: 35000000,
    outstanding: 15000000,
    progress: 70.0,
    dueDate: '2024-02-15',
    status: 'partial'
  },
  {
    id: 2,
    client: 'Skyline Construction Co.',
    project: 'Metro Mall Complex',
    contractValue: 80000000,
    amountPaid: 80000000,
    outstanding: 0,
    progress: 100.0,
    dueDate: '2024-01-30',
    status: 'paid'
  },
  {
    id: 3,
    client: 'City Infrastructure Ltd.',
    project: 'Highway Bridge Project',
    contractValue: 120000000,
    amountPaid: 72000000,
    outstanding: 48000000,
    progress: 60.0,
    dueDate: '2024-01-10',
    status: 'overdue'
  },
  {
    id: 4,
    client: 'Residential Developers Inc.',
    project: 'Luxury Villas Phase 2',
    contractValue: 35000000,
    amountPaid: 0,
    outstanding: 35000000,
    progress: 0.0,
    dueDate: '2024-02-28',
    status: 'pending'
  }
];

const statusColors = {
  paid: 'bg-green-100 text-green-800',
  partial: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
  pending: 'bg-gray-100 text-gray-800'
};

const statusIcons = {
  paid: CheckCircle,
  partial: Clock,
  overdue: AlertTriangle,
  pending: Clock
};

export default function PaymentTracking() {
  const [activeTab, setActiveTab] = useState('tracking');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalContracts = payments.reduce((sum, payment) => sum + payment.contractValue, 0);
  const totalReceived = payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  const totalOutstanding = payments.reduce((sum, payment) => sum + payment.outstanding, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.outstanding, 0);
  const overdueCount = payments.filter(p => p.status === 'overdue').length;

  const filteredPayments = statusFilter === 'all' 
    ? payments 
    : payments.filter(payment => payment.status === statusFilter);

  const overduePayment = payments.find(p => p.status === 'overdue');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Tracking</h1>
          <p className="text-gray-600">Monitor client payments and outstanding balances across all projects</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="h-4 w-4" />
            <span>Record Payment</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Contract</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Total Contracts</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{(totalContracts / 10000000).toFixed(1)}Cr</div>
          <div className="text-sm text-gray-500">{payments.length} contracts</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Amount Received</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{(totalReceived / 10000000).toFixed(1)}Cr</div>
          <div className="text-sm text-gray-500">{((totalReceived / totalContracts) * 100).toFixed(1)}% of total</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Outstanding</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{(totalOutstanding / 10000000).toFixed(1)}Cr</div>
          <div className="text-sm text-gray-500">{((totalOutstanding / totalContracts) * 100).toFixed(1)}% pending</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Overdue</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{(overdueAmount / 10000000).toFixed(1)}Cr</div>
          <div className="text-sm text-gray-500">{overdueCount} overdue</div>
        </div>
      </div>

      {/* Overdue Payment Alert */}
      {overduePayment && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-900">
                Overdue Payment: {overduePayment.client} - {overduePayment.project} - ₹{(overduePayment.outstanding / 10000000).toFixed(1)}Cr due since {overduePayment.dueDate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'tracking', name: 'Payment Tracking' },
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

      {/* Client Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Client Payments</h3>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Filter className="h-4 w-4" />
              </button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client & Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const StatusIcon = statusIcons[payment.status as keyof typeof statusIcons];
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.client}</div>
                          <div className="text-sm text-gray-500">{payment.project}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(payment.contractValue / 10000000).toFixed(1)}Cr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(payment.amountPaid / 10000000).toFixed(1)}Cr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(payment.outstanding / 10000000).toFixed(1)}Cr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              payment.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${payment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{payment.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{payment.dueDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[payment.status as keyof typeof statusColors]}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
