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
  Info,
  X,
  ChevronDown,
  Building2,
  Banknote
} from 'lucide-react';

// Sample payment data matching your design
const paymentHistory = [
  {
    id: 1,
    date: '2024-01-25',
    client: 'Acme Real Estate Pvt. Ltd.',
    project: 'Green Valley Apartments',
    amount: 15000000,
    method: 'Bank Transfer',
    transactionId: 'TXN123456789',
    receivedBy: 'Finance Team',
    notes: 'First milestone payment'
  },
  {
    id: 2,
    date: '2024-01-10',
    client: 'Acme Real Estate Pvt. Ltd.',
    project: 'Green Valley Apartments',
    amount: 20000000,
    method: 'Bank Transfer',
    transactionId: 'TXN987654321',
    receivedBy: 'Finance Team',
    notes: 'Initial advance payment'
  }
];

const contracts = [
  {
    id: 1,
    client: 'Acme Real Estate Pvt. Ltd.',
    project: 'Green Valley Apartments',
    contractValue: 50000000,
    outstanding: 15000000
  },
  {
    id: 2,
    client: 'City Infrastructure Ltd.',
    project: 'Highway Bridge Project',
    contractValue: 120000000,
    outstanding: 48000000
  },
  {
    id: 3,
    client: 'Residential Developers Inc.',
    project: 'Luxury Villas Phase 2',
    contractValue: 35000000,
    outstanding: 35000000
  }
];

const paymentMethods = ['Bank Transfer', 'Cheque', 'Cash', 'Online Payment'];

const paymentTerms = ['15 days', '30 days', '45 days', '60 days', '90 days'];

export default function PaymentTracking() {
  const [activeTab, setActiveTab] = useState('Payment History');
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [recordPaymentForm, setRecordPaymentForm] = useState({
    contract: '',
    amount: '15000000',
    paymentDate: '',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN123456789',
    receivedBy: 'Finance Team',
    notes: ''
  });
  const [addContractForm, setAddContractForm] = useState({
    clientName: 'Acme Real Estate Pvt. Ltd.',
    projectName: 'Green Valley Apartments',
    contractValue: '50000000',
    paymentTerms: '',
    dueDate: '',
    invoiceNumber: 'INV-2024-001',
    notes: ''
  });

  // Handle form input changes
  const handleRecordPaymentInputChange = (field: string, value: string) => {
    setRecordPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddContractInputChange = (field: string, value: string) => {
    setAddContractForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submissions
  const handleRecordPayment = () => {
    console.log('Recording payment:', recordPaymentForm);
    setShowRecordPaymentModal(false);
    setRecordPaymentForm({
      contract: '',
      amount: '15000000',
      paymentDate: '',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN123456789',
      receivedBy: 'Finance Team',
      notes: ''
    });
  };

  const handleAddContract = () => {
    console.log('Adding contract:', addContractForm);
    setShowAddContractModal(false);
    setAddContractForm({
      clientName: 'Acme Real Estate Pvt. Ltd.',
      projectName: 'Green Valley Apartments',
      contractValue: '50000000',
      paymentTerms: '',
      dueDate: '',
      invoiceNumber: 'INV-2024-001',
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.client}</div>
                      <div className="text-sm text-gray-500">{payment.project}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{(payment.amount / 10000000).toFixed(1)}Cr
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Banknote className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.receivedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.notes}
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
      <h3 className="text-lg font-semibold text-gray-900">Payment Analytics</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Payment Status Distribution</h4>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          
          {/* Pie Chart Placeholder */}
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg mb-4">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Pie Chart</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Paid: 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Partial: 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Overdue: 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Pending: 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Payment Trends */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Monthly Payment Trends</h4>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          
          {/* Bar Chart Placeholder */}
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg mb-4">
            <div className="text-center">
              <div className="w-full h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Bar Chart</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Due</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Received</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Payment Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Client Payment Analysis</h4>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        
        {/* Chart Placeholder */}
        <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="w-full h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Client Analysis Chart</span>
            </div>
            <div className="text-xs text-gray-500">
              <div>Residential Develope...</div>
              <div>City Infrastructure...</div>
              <div>Skyline Construction...</div>
              <div>Acme Real Estate Pvt...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Payment Tracking':
        return renderPaymentHistory(); // For now, show payment history as tracking
      case 'Payment History':
        return renderPaymentHistory();
      case 'Analytics':
        return renderAnalytics();
      default:
        return renderPaymentHistory();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Track client payments, manage contracts, and analyze payment trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowRecordPaymentModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Record Payment</span>
          </button>
          <button 
            onClick={() => setShowAddContractModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Contract</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['Payment Tracking', 'Payment History', 'Analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-gray-500 text-gray-900 bg-gray-100'
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

      {/* Record Payment Modal */}
      {showRecordPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Record Payment Received</h2>
                <p className="text-sm text-gray-600">Update payment records for existing contracts</p>
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
                  {/* Select Contract */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Contract</label>
                    <div className="relative">
                      <select
                        value={recordPaymentForm.contract}
                        onChange={(e) => handleRecordPaymentInputChange('contract', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 bg-white"
                      >
                        <option value="">Choose contract</option>
                        {contracts.map(contract => (
                          <option key={contract.id} value={contract.id}>
                            {contract.client} - {contract.project} (Outstanding: ₹{(contract.outstanding / 10000000).toFixed(1)}Cr)
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Amount Received */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount Received (₹)</label>
                    <input
                      type="number"
                      value={recordPaymentForm.amount}
                      onChange={(e) => handleRecordPaymentInputChange('amount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="relative">
                      <select
                        value={recordPaymentForm.paymentMethod}
                        onChange={(e) => handleRecordPaymentInputChange('paymentMethod', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 bg-white"
                      >
                        {paymentMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Payment Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={recordPaymentForm.paymentDate}
                        onChange={(e) => handleRecordPaymentInputChange('paymentDate', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ colorScheme: 'light' }}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
                    <input
                      type="text"
                      value={recordPaymentForm.transactionId}
                      onChange={(e) => handleRecordPaymentInputChange('transactionId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Received By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Received By</label>
                    <input
                      type="text"
                      value={recordPaymentForm.receivedBy}
                      onChange={(e) => handleRecordPaymentInputChange('receivedBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={recordPaymentForm.notes}
                  onChange={(e) => handleRecordPaymentInputChange('notes', e.target.value)}
                  placeholder="Milestone payment, advance, etc."
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

      {/* Add New Payment Contract Modal */}
      {showAddContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Payment Contract</h2>
                <p className="text-sm text-gray-600">Create a new client payment tracking record</p>
              </div>
              <button
                onClick={() => setShowAddContractModal(false)}
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
                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                    <input
                      type="text"
                      value={addContractForm.clientName}
                      onChange={(e) => handleAddContractInputChange('clientName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Contract Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contract Value (₹)</label>
                    <input
                      type="number"
                      value={addContractForm.contractValue}
                      onChange={(e) => handleAddContractInputChange('contractValue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                    <div className="relative">
                      <select
                        value={addContractForm.paymentTerms}
                        onChange={(e) => handleAddContractInputChange('paymentTerms', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 bg-white"
                      >
                        <option value="">Select payment terms</option>
                        {paymentTerms.map(term => (
                          <option key={term} value={term}>{term}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={addContractForm.projectName}
                      onChange={(e) => handleAddContractInputChange('projectName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={addContractForm.dueDate}
                        onChange={(e) => handleAddContractInputChange('dueDate', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ colorScheme: 'light' }}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Invoice Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                    <input
                      type="text"
                      value={addContractForm.invoiceNumber}
                      onChange={(e) => handleAddContractInputChange('invoiceNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={addContractForm.notes}
                  onChange={(e) => handleAddContractInputChange('notes', e.target.value)}
                  placeholder="Additional payment terms or notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowAddContractModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContract}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
