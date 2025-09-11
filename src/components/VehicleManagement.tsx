'use client';

import { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Fuel,
  Wrench,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const vehicles = [
  {
    id: 1,
    name: 'Excavator EX-001',
    type: 'excavator',
    status: 'active',
    location: 'Site A - Mumbai',
    fuelLevel: 85,
    lastService: '2024-01-15',
    nextService: '2024-02-15',
    operator: 'Rajesh Kumar',
    siteId: 'site-1',
    hours: 1250,
    maintenance: 'good'
  },
  {
    id: 2,
    name: 'Crane CR-002',
    type: 'crane',
    status: 'maintenance',
    location: 'Site B - Delhi',
    fuelLevel: 45,
    lastService: '2024-01-20',
    nextService: '2024-01-25',
    operator: 'Priya Sharma',
    siteId: 'site-2',
    hours: 2100,
    maintenance: 'due'
  },
  {
    id: 3,
    name: 'Concrete Mixer CM-003',
    type: 'concrete-mixer',
    status: 'idle',
    location: 'Depot - Pune',
    fuelLevel: 20,
    lastService: '2024-01-10',
    nextService: '2024-02-10',
    operator: 'Amit Patel',
    siteId: null,
    hours: 800,
    maintenance: 'good'
  },
  {
    id: 4,
    name: 'Bulldozer BD-004',
    type: 'bulldozer',
    status: 'active',
    location: 'Site C - Bangalore',
    fuelLevel: 70,
    lastService: '2024-01-18',
    nextService: '2024-02-18',
    operator: 'Suresh Reddy',
    siteId: 'site-3',
    hours: 1500,
    maintenance: 'good'
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  maintenance: 'bg-orange-100 text-orange-800',
  idle: 'bg-gray-100 text-gray-800'
};

const typeIcons = {
  excavator: '🚜',
  crane: '🏗️',
  'concrete-mixer': '🚛',
  bulldozer: '🚧',
  truck: '🚚'
};

export default function VehicleManagement() {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle & Equipment Management</h1>
          <p className="text-gray-600">Track and manage all construction vehicles and equipment</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wrench className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Service Due</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Fuel className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Fuel</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Vehicle List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="idle">Idle</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="excavator">Excavator</option>
              <option value="crane">Crane</option>
              <option value="concrete-mixer">Concrete Mixer</option>
              <option value="bulldozer">Bulldozer</option>
            </select>
          </div>

          {/* Vehicle Cards */}
          <div className="space-y-2">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedVehicle.id === vehicle.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{typeIcons[vehicle.type as keyof typeof typeIcons]}</span>
                      <h3 className="font-medium text-gray-900 text-sm">{vehicle.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{vehicle.location}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vehicle.status as keyof typeof statusColors]}`}>
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Fuel Level</span>
                    <span>{vehicle.fuelLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        vehicle.fuelLevel > 50 ? 'bg-green-500' : 
                        vehicle.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{typeIcons[selectedVehicle.type as keyof typeof typeIcons]}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedVehicle.name}</h2>
                  <p className="text-gray-600">{selectedVehicle.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedVehicle.status as keyof typeof statusColors]}`}>
                  {selectedVehicle.status}
                </span>
              </div>
            </div>

            {/* Vehicle Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Fuel className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fuel Level</p>
                    <p className="text-lg font-bold text-gray-900">{selectedVehicle.fuelLevel}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Operating Hours</p>
                    <p className="text-lg font-bold text-gray-900">{selectedVehicle.hours.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Operator</p>
                    <p className="text-lg font-bold text-gray-900">{selectedVehicle.operator}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Current Site</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedVehicle.siteId ? `Site ${selectedVehicle.siteId.split('-')[1].toUpperCase()}` : 'Depot'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Schedule */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Last Service</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedVehicle.lastService}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wrench className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Next Service</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedVehicle.nextService}</p>
                  <p className="text-xs text-gray-500">
                    {selectedVehicle.maintenance === 'due' ? 'Due Soon' : 'Scheduled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
