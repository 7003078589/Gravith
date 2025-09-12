'use client';

import { useState } from 'react';
import { 
  Package, 
  Plus, 
  Minus,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  MapPin,
  FileText,
  Calendar,
  Download,
  Users,
  BarChart3,
  Info,
  Eye,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

const materials = [
  {
    id: 1,
    name: 'Cement (OPC 53)',
    site: 'Residential Complex A',
    purchased: 500,
    consumed: 320,
    balance: 180,
    unitRate: 425,
    stockValue: 76500,
    status: 'Adequate',
    unit: 'bags'
  },
  {
    id: 2,
    name: 'Steel Bars (12mm)',
    site: 'Residential Complex A',
    purchased: 15000,
    consumed: 8500,
    balance: 6500,
    unitRate: 65,
    stockValue: 422500,
    status: 'Adequate',
    unit: 'kg'
  },
  {
    id: 3,
    name: 'Ready Mix Concrete',
    site: 'Commercial Plaza B',
    purchased: 800,
    consumed: 650,
    balance: 150,
    unitRate: 4500,
    stockValue: 675000,
    status: 'Adequate',
    unit: 'cubic meters'
  },
  {
    id: 4,
    name: 'Cement (OPC 53)',
    site: 'Commercial Plaza B',
    purchased: 300,
    consumed: 180,
    balance: 120,
    unitRate: 430,
    stockValue: 51600,
    status: 'Adequate',
    unit: 'bags'
  },
  {
    id: 5,
    name: 'Bricks',
    site: 'Highway Bridge Project',
    purchased: 50000,
    consumed: 35000,
    balance: 15000,
    unitRate: 8,
    stockValue: 120000,
    status: 'Adequate',
    unit: 'pieces'
  }
];

const purchaseHistory = [
  {
    id: 1,
    material: 'Cement (OPC 53)',
    site: 'Residential Complex A',
    quantity: 200,
    unitRate: 425,
    totalAmount: 85000,
    vendor: 'Cement Corp Ltd',
    date: '25/01/2024',
    invoice: 'INV-2024-001'
  },
  {
    id: 2,
    material: 'Steel Bars (12mm)',
    site: 'Residential Complex A',
    quantity: 5000,
    unitRate: 65,
    totalAmount: 325000,
    vendor: 'Steel Industries',
    date: '20/01/2024',
    invoice: 'SI-2024-045'
  },
  {
    id: 3,
    material: 'Ready Mix Concrete',
    site: 'Commercial Plaza B',
    quantity: 200,
    unitRate: 4500,
    totalAmount: 900000,
    vendor: 'RMC Solutions',
    date: '01/02/2024',
    invoice: 'RMC-2024-012'
  }
];

const periodicEntries = [
  {
    id: 1,
    period: 'Week 6, 2024',
    material: 'Cement (OPC 53)',
    site: 'Residential Complex A',
    received: '200 bags',
    used: '150 bags',
    balance: '50 bags',
    entryDate: '2024-02-10',
    type: 'weekly'
  },
  {
    id: 2,
    period: 'Jan 2024',
    material: 'Steel Bars (12mm)',
    site: 'Commercial Plaza B',
    received: '5000 kg',
    used: '4200 kg',
    balance: '800 kg',
    entryDate: '2024-01-31',
    type: 'monthly'
  }
];

const vendors = [
  {
    id: 1,
    name: 'Cement Corp Ltd',
    orders: 1,
    totalValue: 85000,
    avgOrder: 85000
  },
  {
    id: 2,
    name: 'Steel Industries',
    orders: 1,
    totalValue: 325000,
    avgOrder: 325000
  },
  {
    id: 3,
    name: 'RMC Solutions',
    orders: 1,
    totalValue: 900000,
    avgOrder: 900000
  }
];

const sites = [
  'Residential Complex A',
  'Commercial Plaza B',
  'Highway Bridge Project'
];

const tabs = [
  { id: 'inventory', name: 'Current Inventory', icon: Package },
  { id: 'purchase', name: 'Purchase History', icon: ShoppingCart },
  { id: 'periodic', name: 'Periodic Entry', icon: Calendar },
  { id: 'reports', name: 'Reports & Export', icon: FileText },
  { id: 'vendor', name: 'Vendor Summary', icon: Users },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 }
];

export default function MaterialManagement() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [viewMode, setViewMode] = useState('overall');
  const [selectedSite, setSelectedSite] = useState('All Sites');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showConsumptionModal, setShowConsumptionModal] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    materialName: '',
    site: '',
    quantity: '100',
    unit: '',
    unitRate: '425',
    vendor: '',
    invoiceNumber: 'INV-2024-001',
    purchaseDate: undefined as Date | undefined
  });
  const [consumptionForm, setConsumptionForm] = useState({
    material: '',
    quantity: ''
  });

  const totalMaterials = materials.length;
  const stockValue = materials.reduce((sum, material) => sum + material.stockValue, 0);
  const totalPurchases = purchaseHistory.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const lowStockItems = materials.filter(material => (material.balance / material.purchased) < 0.2).length;

  const units = ['Bags', 'Kilograms', 'Cubic Meters', 'Tons', 'Pieces'];

  const handlePurchaseInputChange = (field: string, value: string | Date | undefined) => {
    setPurchaseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConsumptionInputChange = (field: string, value: string) => {
    setConsumptionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Purchase form submitted:', purchaseForm);
    setShowPurchaseModal(false);
    // Reset form
    setPurchaseForm({
      materialName: '',
      site: '',
      quantity: '100',
      unit: '',
      unitRate: '425',
      vendor: '',
      invoiceNumber: 'INV-2024-001',
      purchaseDate: undefined
    });
  };

  const handleConsumptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Consumption form submitted:', consumptionForm);
    setShowConsumptionModal(false);
    // Reset form
    setConsumptionForm({
      material: '',
      quantity: ''
    });
  };

  const renderCurrentInventory = () => {
    if (viewMode === 'site') {
      // Group materials by site for Site-Based View
      const materialsBySite = materials.reduce((acc, material) => {
        if (!acc[material.site]) {
          acc[material.site] = [];
        }
        acc[material.site].push(material);
        return acc;
      }, {} as Record<string, typeof materials>);

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Material Inventory</h3>
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
            </div>
          </div>

          {/* Site-Based View - Grouped by Site */}
          <div className="space-y-6">
            {Object.entries(materialsBySite).map(([siteName, siteMaterials]) => {
              const totalValue = siteMaterials.reduce((sum, material) => sum + material.stockValue, 0);
              const materialCount = siteMaterials.length;

              return (
                <div key={siteName} className="bg-white border border-gray-200 rounded-lg p-6">
                  {/* Site Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <h4 className="text-lg font-semibold text-gray-900">{siteName}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">Total Value ₹{totalValue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Materials {materialCount}</div>
                    </div>
                  </div>

                  {/* Site Materials Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {siteMaterials.map((material) => (
                          <tr key={material.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{material.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {material.balance.toLocaleString()} {material.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{material.unitRate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{material.stockValue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {material.status}
                              </span>
                            </td>
                          </tr>
                        ))}
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

    // Overall View - Single table with all materials
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Material Inventory</h3>
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
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material & Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchased</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materials.map((material) => (
                <tr key={material.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {material.site}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {material.purchased.toLocaleString()} {material.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {material.consumed.toLocaleString()} {material.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{material.balance.toLocaleString()} {material.unit}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round((material.balance / material.purchased) * 100)}% remaining
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{material.unitRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{material.stockValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {material.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPurchaseHistory = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material & Site</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchaseHistory.map((purchase) => (
              <tr key={purchase.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{purchase.material}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {purchase.site}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {purchase.quantity.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{purchase.unitRate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{purchase.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {purchase.vendor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {purchase.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {purchase.invoice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPeriodicEntry = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Periodic Material Entry</h3>
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">Weekly & Monthly Tracking</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Material Entry */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Weekly Material Entry
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Week</label>
              <input
                type="text"
                placeholder="Week --, ----"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Choose material</option>
                <option>Cement (OPC 53)</option>
                <option>Steel Bars (12mm)</option>
                <option>Ready Mix Concrete</option>
                <option>Bricks</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Received</label>
                <input
                  type="number"
                  defaultValue="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Used</label>
                <input
                  type="number"
                  defaultValue="80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                placeholder="Weekly consumption notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Weekly Entry</span>
            </button>
          </div>
        </div>

        {/* Monthly Material Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Monthly Material Summary
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
              <input
                type="text"
                placeholder="--------, ----"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Choose site</option>
                {sites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Received</label>
                <input
                  type="number"
                  defaultValue="2000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Consumed</label>
                <input
                  type="number"
                  defaultValue="1800"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Summary</label>
              <textarea
                placeholder="Monthly consumption summary"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <button className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FileText className="h-4 w-4" />
              <span>Generate Monthly Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Periodic Entries */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Periodic Entries</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {periodicEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      entry.type === 'weekly' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {entry.period}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.material}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.site}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.received}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.used}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.balance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.entryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReportsExport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Reports & Export</h3>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          <span>Generate PDF Reports</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom Date Range Export */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Custom Date Range Export
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Choose report type</option>
                <option>Material Inventory</option>
                <option>Purchase History</option>
                <option>Consumption Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Filter (Optional)</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All sites</option>
                {sites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>
            <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Generate PDF Report</span>
            </button>
          </div>
        </div>

        {/* Monthly Reports */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Monthly Reports
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
              <input
                type="text"
                placeholder="---, ----"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Choose format</option>
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Include Charts</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Chart options</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <button className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download Monthly Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Export Options */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Export Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 cursor-pointer">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h5 className="font-medium text-gray-900">Current Week</h5>
            <p className="text-sm text-gray-600">PDF Export</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 cursor-pointer">
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h5 className="font-medium text-gray-900">Current Month</h5>
            <p className="text-sm text-gray-600">PDF Export</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 cursor-pointer">
            <Download className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h5 className="font-medium text-gray-900">Last Quarter</h5>
            <p className="text-sm text-gray-600">PDF Export</p>
          </div>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Exports</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Material Inventory Summary</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dec 2023 - Mar 2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-02-05 14:30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2.4 MB</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-700">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVendorSummary = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Vendor Performance Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{vendor.name}</h4>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Orders:</span>
                <span className="text-sm font-medium text-gray-900">{vendor.orders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Value:</span>
                <span className="text-sm font-medium text-gray-900">₹{vendor.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Order:</span>
                <span className="text-sm font-medium text-gray-900">₹{vendor.avgOrder.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Category Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Material Category Distribution
            <Info className="h-4 w-4 ml-2 text-gray-400" />
          </h4>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                {/* Pie Chart Placeholder */}
                <div className="w-full h-full rounded-full border-8 border-orange-300 relative">
                  <div className="absolute inset-0 rounded-full border-8 border-blue-300 transform rotate-90"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-yellow-300 transform rotate-180"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-teal-300 transform rotate-270"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Bricks</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cement</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Concrete</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-teal-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Steel</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Site-wise Material Value */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Site-wise Material Value
            <Info className="h-4 w-4 ml-2 text-gray-400" />
          </h4>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-4">Bar Chart: Site-wise Material Value</div>
              <div className="flex items-end space-x-4 h-32">
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-blue-500 rounded-t" style={{ height: '60%' }}></div>
                  <span className="text-xs text-gray-600 mt-2">Residential A</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-blue-500 rounded-t" style={{ height: '80%' }}></div>
                  <span className="text-xs text-gray-600 mt-2">Commercial B</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-blue-500 rounded-t" style={{ height: '20%' }}></div>
                  <span className="text-xs text-gray-600 mt-2">Highway Bridge</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Values in ₹Lakhs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Company Title */}
      <div className="text-center mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Gavith Construction Pvt. Ltd.</h1>
      </div>

      {/* Page Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Material Management</h2>
          <p className="text-gray-600">Global overview of inventory across all construction sites.</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button 
            variant="outline"
            onClick={() => setShowConsumptionModal(true)}
            className="flex items-center space-x-2"
          >
            <Minus className="h-4 w-4" />
            <span>Record Consumption</span>
          </Button>
          <Button 
            onClick={() => setShowPurchaseModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Purchase</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Materials</p>
            <p className="text-2xl font-bold text-gray-900">{totalMaterials} <span className="text-sm text-gray-500">Across 3 sites</span></p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Stock Value</p>
            <p className="text-2xl font-bold text-gray-900">₹{(stockValue / 100000).toFixed(1)}Cr</p>
            <p className="text-xs text-gray-500">Current inventory</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Purchases</p>
            <p className="text-2xl font-bold text-gray-900">₹{(totalPurchases / 100000).toFixed(1)}Cr</p>
            <p className="text-xs text-gray-500">All time</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Low Stock Items</p>
            <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            <p className="text-xs text-gray-500">Need attention</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'inventory' && renderCurrentInventory()}
          {activeTab === 'purchase' && renderPurchaseHistory()}
          {activeTab === 'periodic' && renderPeriodicEntry()}
          {activeTab === 'reports' && renderReportsExport()}
          {activeTab === 'vendor' && renderVendorSummary()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>

      {/* Record Material Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Record Material Purchase</h2>
                <p className="text-gray-600">Add a new material purchase to inventory.</p>
              </div>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="materialName" className="text-sm font-medium text-gray-700">
                      Material Name
                    </Label>
                    <Input
                      id="materialName"
                      type="text"
                      value={purchaseForm.materialName}
                      onChange={(e) => handlePurchaseInputChange('materialName', e.target.value)}
                      placeholder="e.g., Cement (OPC 53)"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="site" className="text-sm font-medium text-gray-700">
                      Site
                    </Label>
                    <Select value={purchaseForm.site} onValueChange={(value) => handlePurchaseInputChange('site', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={purchaseForm.quantity}
                      onChange={(e) => handlePurchaseInputChange('quantity', e.target.value)}
                      placeholder="100"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
                      Unit
                    </Label>
                    <Select value={purchaseForm.unit} onValueChange={(value) => handlePurchaseInputChange('unit', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="unitRate" className="text-sm font-medium text-gray-700">
                      Unit Rate (₹)
                    </Label>
                    <Input
                      id="unitRate"
                      type="number"
                      value={purchaseForm.unitRate}
                      onChange={(e) => handlePurchaseInputChange('unitRate', e.target.value)}
                      placeholder="425"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                      Vendor
                    </Label>
                    <Input
                      id="vendor"
                      type="text"
                      value={purchaseForm.vendor}
                      onChange={(e) => handlePurchaseInputChange('vendor', e.target.value)}
                      placeholder="Vendor Name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="invoiceNumber" className="text-sm font-medium text-gray-700">
                      Invoice Number
                    </Label>
                    <Input
                      id="invoiceNumber"
                      type="text"
                      value={purchaseForm.invoiceNumber}
                      onChange={(e) => handlePurchaseInputChange('invoiceNumber', e.target.value)}
                      placeholder="INV-2024-001"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="purchaseDate" className="text-sm font-medium text-gray-700">
                      Purchase Date
                    </Label>
                    <div className="mt-1">
                      <DatePicker
                        value={purchaseForm.purchaseDate}
                        onChange={(date) => handlePurchaseInputChange('purchaseDate', date)}
                        placeholder="Select purchase date"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPurchaseModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Record Purchase
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Material Consumption Modal */}
      {showConsumptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Record Material Consumption</h2>
                <p className="text-gray-600">Update material usage and consumption tracking.</p>
              </div>
              <button
                onClick={() => setShowConsumptionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleConsumptionSubmit} className="space-y-6">
              <div>
                <Label htmlFor="material" className="text-sm font-medium text-gray-700">
                  Select Material
                </Label>
                <Select value={consumptionForm.material} onValueChange={(value) => handleConsumptionInputChange('material', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id.toString()}>
                        {material.name} - {material.site} (Available: {material.balance} {material.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity Consumed
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={consumptionForm.quantity}
                  onChange={(e) => handleConsumptionInputChange('quantity', e.target.value)}
                  placeholder="Enter quantity"
                  className="mt-1"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConsumptionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Record Consumption
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}