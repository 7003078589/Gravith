'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Fuel,
  Settings,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'idle';
  location: string;
  fuelLevel: number;
  nextMaintenance: string;
  dailyRate: number;
}

const VehicleManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data - will be replaced with real API data
  const vehicles: Vehicle[] = [];
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const totalCost = vehicles.reduce((sum, v) => sum + v.dailyRate, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'maintenance', label: 'Maintenance', icon: Settings },
    { id: 'reports', label: 'Reports', icon: Download }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Vehicle & Equipment Management</h1>
        <p className="text-gray-600">Manage your construction vehicles and equipment</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Vehicles</p>
              <p className="text-3xl font-bold text-gray-900">{totalVehicles}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-3xl font-bold text-gray-900">{activeVehicles}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Maintenance</p>
              <p className="text-3xl font-bold text-gray-900">{maintenanceVehicles}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Costs</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Fuel className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Found</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first vehicle or equipment.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto">
                  <Plus className="h-4 w-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search vehicles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="excavator">Excavator</option>
                    <option value="crane">Crane</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>

              <div className="text-center py-12">
                <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Found</h3>
                <p className="text-gray-500">Add vehicles to start tracking your equipment.</p>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Maintenance Schedule</h3>
              <p className="text-gray-500">No maintenance records found.</p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <Download className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
              <p className="text-gray-500">Generate reports for vehicle usage and costs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;