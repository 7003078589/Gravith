'use client';

import { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar
} from 'lucide-react';

const materials = [
  {
    id: 1,
    name: 'Portland Cement',
    category: 'cement',
    quantity: 150,
    unit: 'bags',
    costPerUnit: 350,
    supplier: 'ACC Limited',
    siteId: 'site-1',
    lastUpdated: '2024-01-20',
    minThreshold: 50,
    status: 'low'
  },
  {
    id: 2,
    name: 'Steel Rods (12mm)',
    category: 'steel',
    quantity: 2500,
    unit: 'kg',
    costPerUnit: 65,
    supplier: 'Tata Steel',
    siteId: 'site-2',
    lastUpdated: '2024-01-18',
    minThreshold: 1000,
    status: 'good'
  },
  {
    id: 3,
    name: 'Red Bricks',
    category: 'bricks',
    quantity: 5000,
    unit: 'pieces',
    costPerUnit: 8,
    supplier: 'Local Supplier',
    siteId: 'site-1',
    lastUpdated: '2024-01-19',
    minThreshold: 2000,
    status: 'good'
  },
  {
    id: 4,
    name: 'Fine Sand',
    category: 'sand',
    quantity: 80,
    unit: 'cubic meters',
    costPerUnit: 1200,
    supplier: 'River Sand Co.',
    siteId: 'site-3',
    lastUpdated: '2024-01-17',
    minThreshold: 30,
    status: 'critical'
  }
];

const statusColors = {
  good: 'bg-green-100 text-green-800',
  low: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800'
};

const categoryIcons = {
  cement: '🏗️',
  steel: '🔩',
  bricks: '🧱',
  sand: '🏖️',
  aggregate: '🪨',
  other: '📦'
};

export default function MaterialManagement() {
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || material.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalValue = materials.reduce((sum, material) => sum + (material.quantity * material.costPerUnit), 0);
  const lowStockCount = materials.filter(m => m.status === 'low' || m.status === 'critical').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Material Management</h1>
          <p className="text-gray-600">Track inventory and manage construction materials</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Material</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Materials</p>
              <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{(totalValue / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Sites</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Material List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
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
              <option value="cement">Cement</option>
              <option value="steel">Steel</option>
              <option value="bricks">Bricks</option>
              <option value="sand">Sand</option>
              <option value="aggregate">Aggregate</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="good">Good Stock</option>
              <option value="low">Low Stock</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Material Cards */}
          <div className="space-y-2">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                onClick={() => setSelectedMaterial(material)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMaterial.id === material.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{categoryIcons[material.category as keyof typeof categoryIcons]}</span>
                      <h3 className="font-medium text-gray-900 text-sm">{material.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{material.supplier}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[material.status as keyof typeof statusColors]}`}>
                        {material.status}
                      </span>
                    </div>
                  </div>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Stock Level</span>
                    <span>{material.quantity} {material.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        material.status === 'critical' ? 'bg-red-500' : 
                        material.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (material.quantity / (material.minThreshold * 2)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Material Details */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{categoryIcons[selectedMaterial.category as keyof typeof categoryIcons]}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMaterial.name}</h2>
                  <p className="text-gray-600">{selectedMaterial.supplier}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedMaterial.status as keyof typeof statusColors]}`}>
                  {selectedMaterial.status} stock
                </span>
              </div>
            </div>

            {/* Material Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Current Stock</p>
                    <p className="text-lg font-bold text-gray-900">{selectedMaterial.quantity} {selectedMaterial.unit}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Min Threshold</p>
                    <p className="text-lg font-bold text-gray-900">{selectedMaterial.minThreshold} {selectedMaterial.unit}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Cost per Unit</p>
                    <p className="text-lg font-bold text-gray-900">₹{selectedMaterial.costPerUnit}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-lg font-bold text-gray-900">₹{(selectedMaterial.quantity * selectedMaterial.costPerUnit).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Level Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Stock Level</span>
                <span className="text-sm font-bold text-gray-900">
                  {selectedMaterial.quantity} / {selectedMaterial.minThreshold * 2} {selectedMaterial.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    selectedMaterial.status === 'critical' ? 'bg-red-500' : 
                    selectedMaterial.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (selectedMaterial.quantity / (selectedMaterial.minThreshold * 2)) * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Empty</span>
                <span>Min Threshold</span>
                <span>Full Stock</span>
              </div>
            </div>

            {/* Material Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{selectedMaterial.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Unit</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMaterial.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Supplier</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMaterial.supplier}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMaterial.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Site Location</span>
                    <span className="text-sm font-medium text-gray-900">Site {selectedMaterial.siteId.split('-')[1].toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`text-sm font-medium ${statusColors[selectedMaterial.status as keyof typeof statusColors]}`}>
                      {selectedMaterial.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
