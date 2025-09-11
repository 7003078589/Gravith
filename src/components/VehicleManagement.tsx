'use client';

import { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Settings,
  MapPin,
  Fuel,
  DollarSign,
  BarChart3,
  TrendingUp,
  PieChart,
  X,
  Calendar,
  ChevronDown
} from 'lucide-react';

const vehicles = [
  {
    id: 1,
    registration: 'MH-12-AB-1234',
    type: 'Excavator',
    provider: 'Heavy Equipment Rentals',
    site: 'Residential Complex A',
    rentalCost: 5324500,
    rentalBreakdown: '601d × ₹8500 + 180h × ₹1200',
    fuelCost: 36100,
    fuelBreakdown: '380L × ₹95',
    totalCost: 5360600,
    status: 'active'
  },
  {
    id: 2,
    registration: 'MH-14-CD-5678',
    type: 'Crane',
    provider: 'City Crane Services',
    site: 'Commercial Plaza B',
    rentalCost: 7329000,
    rentalBreakdown: '589d × ₹12000 + 145h × ₹1800',
    fuelCost: 73500,
    fuelBreakdown: '750L × ₹98',
    totalCost: 7402500,
    status: 'active'
  },
  {
    id: 3,
    registration: 'GJ-05-EF-9012',
    type: 'Generator',
    provider: 'Power Solutions Ltd',
    site: 'Residential Complex A',
    rentalCost: 2246000,
    rentalBreakdown: '596d × ₹3500 + 320h × ₹500',
    fuelCost: 25760,
    fuelBreakdown: '280L × ₹92',
    totalCost: 2271760,
    status: 'active'
  }
];

const tabs = [
  { id: 'all', name: 'All Vehicles' },
  { id: 'type', name: 'By Type' },
  { id: 'site', name: 'By Site' },
  { id: 'analytics', name: 'Analytics' }
];

export default function VehicleManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: 'MH-12-AB-1234',
    vendor: 'Heavy Equipment Rentals',
    rentalStartDate: '',
    rentalEndDate: '',
    perDayCost: '8500',
    perHourCost: '1200',
    odometerReading: '45230',
    dieselCost: '95',
    vehicleType: '',
    assignedSite: ''
  });

  const totalFleet = vehicles.length;
  const totalRentalCost = vehicles.reduce((sum, vehicle) => sum + vehicle.rentalCost, 0);
  const totalFuelCost = vehicles.reduce((sum, vehicle) => sum + vehicle.fuelCost, 0);
  const totalCost = totalRentalCost + totalFuelCost;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount}`;
  };

  const formatDetailedCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getVehiclesByType = () => {
    const grouped = vehicles.reduce((acc, vehicle) => {
      if (!acc[vehicle.type]) {
        acc[vehicle.type] = [];
      }
      acc[vehicle.type].push(vehicle);
      return acc;
    }, {} as Record<string, typeof vehicles>);
    return grouped;
  };

  const getVehiclesBySite = () => {
    const grouped = vehicles.reduce((acc, vehicle) => {
      if (!acc[vehicle.site]) {
        acc[vehicle.site] = [];
      }
      acc[vehicle.site].push(vehicle);
      return acc;
    }, {} as Record<string, typeof vehicles>);
    return grouped;
  };

  const vehicleTypes = [
    'Excavator', 'Crane', 'Dumper', 'Loader', 'Mixer', 
    'Compactor', 'Bulldozer', 'Generator', 'Welding Machine', 'Pump'
  ];

  const sites = [
    { name: 'Residential Complex A', equipment: ['Excavator', 'Crane', 'Mixer'] },
    { name: 'Commercial Plaza B', equipment: ['Dumper', 'Loader', 'Generator'] },
    { name: 'Highway Bridge Project', equipment: ['Bulldozer', 'Compactor', 'Welding Machine'] },
    { name: 'Industrial Zone C', equipment: ['Pump', 'Excavator', 'Crane'] },
    { name: 'Shopping Mall D', equipment: ['Mixer', 'Generator', 'Loader'] }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setShowAddModal(false);
    // Reset form
    setFormData({
      vehicleNumber: 'MH-12-AB-1234',
      vendor: 'Heavy Equipment Rentals',
      rentalStartDate: '',
      rentalEndDate: '',
      perDayCost: '8500',
      perHourCost: '1200',
      odometerReading: '45230',
      dieselCost: '95',
      vehicleType: '',
      assignedSite: ''
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gavith Construction Pvt. Ltd.</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Vehicle & Equipment Management</h2>
        <p className="text-sm sm:text-base text-gray-600 px-4">Comprehensive fleet tracking with costs and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fleet</p>
              <p className="text-3xl font-bold text-gray-900">{totalFleet}</p>
              <p className="text-xs text-gray-500">{totalFleet} active</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rental Costs</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRentalCost)}</p>
              <p className="text-xs text-gray-500">Equipment hire</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fuel Costs</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalFuelCost)}</p>
              <p className="text-xs text-gray-500">Diesel expenses</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Fuel className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-gray-500">Rental + Fuel</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Settings className="h-4 w-4" />
          <span>Custom Types</span>
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'all' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Complete Fleet Overview</h3>
                <div className="flex space-x-4">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>All Types</option>
                    <option>Excavator</option>
                    <option>Crane</option>
                    <option>Generator</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>All Sites</option>
                    <option>Residential Complex A</option>
                    <option>Commercial Plaza B</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Vehicle Details</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Site Assignment</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Rental Costs</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Fuel Usage</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Total Cost</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Truck className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{vehicle.registration}</p>
                              <p className="text-sm text-gray-600">{vehicle.type}</p>
                              <p className="text-xs text-gray-500">{vehicle.provider}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{vehicle.site}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{formatDetailedCurrency(vehicle.rentalCost)}</p>
                            <p className="text-xs text-gray-500">{vehicle.rentalBreakdown}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{formatDetailedCurrency(vehicle.fuelCost)}</p>
                            <p className="text-xs text-gray-500">{vehicle.fuelBreakdown}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-gray-900">{formatDetailedCurrency(vehicle.totalCost)}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {vehicle.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'type' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Vehicles Grouped by Type</h3>
              <div className="space-y-6">
                {Object.entries(getVehiclesByType()).map(([type, typeVehicles]) => (
                  <div key={type}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">{type} ({typeVehicles.length})</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {typeVehicles.map((vehicle) => (
                        <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-semibold text-gray-900">{vehicle.registration}</p>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {vehicle.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{vehicle.site}</p>
                          <p className="text-sm text-gray-500 mb-2">{vehicle.provider}</p>
                          <p className="font-semibold text-gray-900">Total Cost: {formatDetailedCurrency(vehicle.totalCost)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'site' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Vehicles by Site Assignment</h3>
              <div className="space-y-6">
                {Object.entries(getVehiclesBySite()).map(([site, siteVehicles]) => (
                  <div key={site}>
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <h4 className="text-lg font-semibold text-gray-900">{site} ({siteVehicles.length})</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {siteVehicles.map((vehicle) => (
                        <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-semibold text-gray-900">{vehicle.registration}</p>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {vehicle.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{vehicle.type}</p>
                          <p className="text-sm text-gray-500 mb-2">{vehicle.provider}</p>
                          <p className="font-semibold text-gray-900">Total Cost: {formatDetailedCurrency(vehicle.totalCost)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet Analytics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Fleet Distribution by Type</h4>
                  <div className="flex items-center justify-center">
                    <div className="w-48 h-48 relative">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          strokeDasharray="33 100"
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeDasharray="33 100"
                          strokeDashoffset="-33"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="8"
                          strokeDasharray="33 100"
                          strokeDashoffset="-66"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">3</p>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Excavator</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">33%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Crane</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">33%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Generator</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">33%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown by Vehicle</h4>
                  <div className="space-y-4">
                    {vehicles.map((vehicle, index) => (
                      <div key={vehicle.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{vehicle.registration}</span>
                            <span className="text-sm font-medium text-gray-900">{formatDetailedCurrency(vehicle.totalCost)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(vehicle.totalCost / Math.max(...vehicles.map(v => v.totalCost))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <style jsx>{`
              input[type="date"]::-webkit-calendar-picker-indicator {
                background: transparent;
                bottom: 0;
                color: transparent;
                cursor: pointer;
                height: auto;
                left: 0;
                position: absolute;
                right: 0;
                top: 0;
                width: auto;
                opacity: 0;
              }
              input[type="date"]::-webkit-datetime-edit-text {
                color: #374151;
              }
              input[type="date"]::-webkit-datetime-edit-month-field {
                color: #374151;
              }
              input[type="date"]::-webkit-datetime-edit-day-field {
                color: #374151;
              }
              input[type="date"]::-webkit-datetime-edit-year-field {
                color: #374151;
              }
            `}</style>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle/Equipment</h2>
                <p className="text-gray-600">Register a new vehicle or equipment to your fleet.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleNumber}
                      onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MH-12-AB-1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor/Rental Company
                    </label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) => handleInputChange('vendor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Heavy Equipment Rentals"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rental Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.rentalStartDate}
                        onChange={(e) => handleInputChange('rentalStartDate', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ colorScheme: 'light' }}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per Day Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.perDayCost}
                      onChange={(e) => handleInputChange('perDayCost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Starting Odometer Reading (km)
                    </label>
                    <input
                      type="number"
                      value={formData.odometerReading}
                      onChange={(e) => handleInputChange('odometerReading', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="45230"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle/Equipment Type
                    </label>
                    <div className="relative">
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 bg-white"
                      >
                        <option value="">Select type</option>
                        {vehicleTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign to Site
                    </label>
                    <div className="relative">
                      <select
                        value={formData.assignedSite}
                        onChange={(e) => handleInputChange('assignedSite', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 bg-white"
                      >
                        <option value="">Select site</option>
                        {sites.map((site) => (
                          <option key={site.name} value={site.name}>
                            {site.name} ({site.equipment.join(', ')})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rental End Date (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.rentalEndDate}
                        onChange={(e) => handleInputChange('rentalEndDate', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ colorScheme: 'light' }}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per Hour Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.perHourCost}
                      onChange={(e) => handleInputChange('perHourCost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diesel Cost/L (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.dieselCost}
                      onChange={(e) => handleInputChange('dieselCost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="95"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}