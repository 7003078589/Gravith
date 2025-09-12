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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

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

// Client payments data for Payment Tracking view
const clientPayments = [
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
  const [activeTab, setActiveTab] = useState('Payment Tracking');
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

  const renderPaymentTracking = () => {
    const totalContracts = clientPayments.reduce((sum, payment) => sum + payment.contractValue, 0);
    const totalReceived = clientPayments.reduce((sum, payment) => sum + payment.amountPaid, 0);
    const totalOutstanding = clientPayments.reduce((sum, payment) => sum + payment.outstanding, 0);
    const overdueAmount = clientPayments.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.outstanding, 0);
    const overdueCount = clientPayments.filter(p => p.status === 'overdue').length;
    const overduePayment = clientPayments.find(p => p.status === 'overdue');

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
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
            <div className="text-sm text-gray-500">{clientPayments.length} contracts</div>
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

        {/* Client Payments Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Client Payments</h3>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] h-8 text-sm">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
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
                {clientPayments.map((payment) => {
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
          
          {/* Pie Chart */}
          <div className="flex items-center justify-center h-48 mb-4">
            <div className="text-center">
              {/* Simple Pie Chart using CSS */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)'}}></div>
                <div className="absolute inset-0 rounded-full border-8 border-orange-500" style={{clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)'}}></div>
                <div className="absolute inset-0 rounded-full border-8 border-red-500" style={{clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%)'}}></div>
                <div className="absolute inset-0 rounded-full border-8 border-gray-500" style={{clipPath: 'polygon(50% 50%, 0% 50%, 0% 100%)'}}></div>
                <div className="absolute inset-0 rounded-full border-8 border-white"></div>
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
          
          {/* Bar Chart */}
          <div className="h-48 mb-4">
            <div className="flex items-end justify-between h-full px-4">
              {/* Oct */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex flex-col space-y-1">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '60px'}}></div>
                  <div className="w-8 bg-orange-500 rounded-t" style={{height: '80px'}}></div>
                </div>
                <span className="text-xs text-gray-600">Oct</span>
              </div>
              {/* Nov */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex flex-col space-y-1">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '90px'}}></div>
                  <div className="w-8 bg-orange-500 rounded-t" style={{height: '80px'}}></div>
                </div>
                <span className="text-xs text-gray-600">Nov</span>
              </div>
              {/* Dec */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex flex-col space-y-1">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '70px'}}></div>
                  <div className="w-8 bg-orange-500 rounded-t" style={{height: '100px'}}></div>
                </div>
                <span className="text-xs text-gray-600">Dec</span>
              </div>
              {/* Jan */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex flex-col space-y-1">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '150px'}}></div>
                  <div className="w-8 bg-orange-500 rounded-t" style={{height: '130px'}}></div>
                </div>
                <span className="text-xs text-gray-600">Jan</span>
              </div>
              {/* Feb */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex flex-col space-y-1">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '30px'}}></div>
                  <div className="w-8 bg-orange-500 rounded-t" style={{height: '120px'}}></div>
                </div>
                <span className="text-xs text-gray-600">Feb</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
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

      {/* Client Payment Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Client Payment Analysis</h4>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        
        {/* Client Analysis Chart */}
        <div className="h-48">
          <div className="flex items-end justify-between h-full px-4">
            {/* Client bars */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 bg-blue-500 rounded-t" style={{height: '40px'}}></div>
              <span className="text-xs text-gray-600 text-center">Residential<br/>Develope...</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 bg-blue-500 rounded-t" style={{height: '60px'}}></div>
              <span className="text-xs text-gray-600 text-center">City<br/>Infrastructure...</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 bg-blue-500 rounded-t" style={{height: '80px'}}></div>
              <span className="text-xs text-gray-600 text-center">Skyline<br/>Construction...</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 bg-blue-500 rounded-t" style={{height: '100px'}}></div>
              <span className="text-xs text-gray-600 text-center">Acme Real<br/>Estate Pvt...</span>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500">
            <span>₹0.0Cr</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Payment Tracking':
        return renderPaymentTracking();
      case 'Payment History':
        return renderPaymentHistory();
      case 'Analytics':
        return renderAnalytics();
      default:
        return renderPaymentTracking();
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
          <Button 
            onClick={() => setShowRecordPaymentModal(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Record Payment</span>
          </Button>
          <Button 
            onClick={() => setShowAddContractModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Contract</span>
          </Button>
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
                    <Label htmlFor="contract" className="text-sm font-medium text-gray-700">
                      Select Contract
                    </Label>
                    <Select value={recordPaymentForm.contract} onValueChange={(value) => handleRecordPaymentInputChange('contract', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose contract" />
                      </SelectTrigger>
                      <SelectContent>
                        {contracts.map(contract => (
                          <SelectItem key={contract.id} value={contract.id.toString()}>
                            {contract.client} - {contract.project} (Outstanding: ₹{(contract.outstanding / 10000000).toFixed(1)}Cr)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Received */}
                  <div>
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                      Amount Received (₹)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={recordPaymentForm.amount}
                      onChange={(e) => handleRecordPaymentInputChange('amount', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
                      Payment Method
                    </Label>
                    <Select value={recordPaymentForm.paymentMethod} onValueChange={(value) => handleRecordPaymentInputChange('paymentMethod', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Payment Date */}
                  <div>
                    <Label htmlFor="paymentDate" className="text-sm font-medium text-gray-700">
                      Payment Date
                    </Label>
                    <DatePicker
                      value={recordPaymentForm.paymentDate ? new Date(recordPaymentForm.paymentDate) : undefined}
                      onChange={(date) => handleRecordPaymentInputChange('paymentDate', date?.toISOString().split('T')[0] || '')}
                      placeholder="Select payment date"
                    />
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <Label htmlFor="transactionId" className="text-sm font-medium text-gray-700">
                      Transaction ID
                    </Label>
                    <Input
                      id="transactionId"
                      type="text"
                      value={recordPaymentForm.transactionId}
                      onChange={(e) => handleRecordPaymentInputChange('transactionId', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Received By */}
                  <div>
                    <Label htmlFor="receivedBy" className="text-sm font-medium text-gray-700">
                      Received By
                    </Label>
                    <Input
                      id="receivedBy"
                      type="text"
                      value={recordPaymentForm.receivedBy}
                      onChange={(e) => handleRecordPaymentInputChange('receivedBy', e.target.value)}
                      className="mt-1"
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
                    <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                      Client Name
                    </Label>
                    <Input
                      id="clientName"
                      type="text"
                      value={addContractForm.clientName}
                      onChange={(e) => handleAddContractInputChange('clientName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Contract Value */}
                  <div>
                    <Label htmlFor="contractValue" className="text-sm font-medium text-gray-700">
                      Contract Value (₹)
                    </Label>
                    <Input
                      id="contractValue"
                      type="number"
                      value={addContractForm.contractValue}
                      onChange={(e) => handleAddContractInputChange('contractValue', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <Label htmlFor="paymentTerms" className="text-sm font-medium text-gray-700">
                      Payment Terms
                    </Label>
                    <Select value={addContractForm.paymentTerms} onValueChange={(value) => handleAddContractInputChange('paymentTerms', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTerms.map(term => (
                          <SelectItem key={term} value={term}>{term}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Project Name */}
                  <div>
                    <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                      Project Name
                    </Label>
                    <Input
                      id="projectName"
                      type="text"
                      value={addContractForm.projectName}
                      onChange={(e) => handleAddContractInputChange('projectName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                      Due Date
                    </Label>
                    <DatePicker
                      value={addContractForm.dueDate ? new Date(addContractForm.dueDate) : undefined}
                      onChange={(date) => handleAddContractInputChange('dueDate', date?.toISOString().split('T')[0] || '')}
                      placeholder="Select due date"
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
                      value={addContractForm.invoiceNumber}
                      onChange={(e) => handleAddContractInputChange('invoiceNumber', e.target.value)}
                      className="mt-1"
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
              <Button
                variant="outline"
                onClick={() => setShowAddContractModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddContract}
              >
                Create Contract
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
