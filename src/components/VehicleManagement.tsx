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
  Download,
  X,
  MapPin,
  Edit,
  Trash2,
  MoreVertical,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useVehicles } from '@/hooks/useApi';
import { useRefuelingRecords, useUsageRecords } from '@/hooks/useVehicleTracking';
import { formatDateForInput, parseDateFromInput } from '@/lib/dateUtils';
import { useUnits } from '@/contexts/UnitContext';
import VehicleAnalytics from './VehicleAnalytics';
import PageTitle from './PageTitle';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'idle';
  location: string;
  fuelLevel: number;
  nextMaintenance: string;
  dailyRate: number;
  currentMileage: number;
  fuelCapacity: number;
  averageMileage: number;
}

interface RefuelingRecord {
  id: number;
  vehicle_id: string;
  refueling_date: string;
  mileage: number;
  fuel_amount: number;
  fuel_cost: number;
  fuel_type: string;
  station_name: string;
  notes?: string;
  vehicle_name?: string;
  vehicle_type?: string;
}

interface UsageRecord {
  id: number;
  vehicle_id: string;
  usage_date: string;
  start_mileage: number;
  end_mileage: number;
  distance: number;
  start_location: string;
  end_location: string;
  purpose: string;
  driver_name: string;
  fuel_consumed: number;
  notes?: string;
  vehicle_name?: string;
  vehicle_type?: string;
}

const VehicleManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
  const [showRefuelingModal, setShowRefuelingModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    type: '',
    status: 'active',
    location: '',
    fuelLevel: '',
    nextMaintenance: '',
    dailyRate: '',
    operator: '',
    licensePlate: '',
    purchaseDate: undefined as Date | undefined
  });

  const [refuelingForm, setRefuelingForm] = useState({
    vehicle_id: '',
    refueling_date: '',
    mileage: '',
    fuel_amount: '',
    fuel_cost: '',
    fuel_type: 'Diesel',
    station_name: '',
    notes: ''
  });

  const [usageForm, setUsageForm] = useState({
    vehicle_id: '',
    usage_date: '',
    start_mileage: '',
    end_mileage: '',
    start_location: '',
    end_location: '',
    purpose: '',
    driver_name: '',
    fuel_consumed: '',
    notes: ''
  });

  // Get real data from database
  const { data: refuelingRecords, loading: refuelingLoading, addRecord: addRefuelingRecord, updateRecord: updateRefuelingRecord, deleteRecord: deleteRefuelingRecord } = useRefuelingRecords();
  const { data: usageRecords, loading: usageLoading, addRecord: addUsageRecord, updateRecord: updateUsageRecord, deleteRecord: deleteUsageRecord } = useUsageRecords();

  // Get real vehicle data from database
  const { data: vehiclesData, loading: vehiclesLoading, error: vehiclesError } = useVehicles();
  const { formatCurrency, formatDistance, formatWeight, formatVolume, formatArea, units, convertToBaseCurrency } = useUnits();
  
  // Transform database data to match component interface
  const vehicles: Vehicle[] = (vehiclesData as any[])?.map((v: any) => ({
    id: v.id,
    name: v.name,
    type: v.type,
    status: v.status,
    location: v.location || 'Not specified',
    fuelLevel: v.fuel_level || 100,
    nextMaintenance: v.next_service_date ? (typeof v.next_service_date === 'string' ? v.next_service_date : v.next_service_date.toISOString().split('T')[0]) : '',
    dailyRate: parseFloat(v.purchase_price) || 0,
    currentMileage: v.current_mileage || 0,
    fuelCapacity: v.fuel_capacity || 0,
    averageMileage: v.average_mileage || 0
  })) || [];

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const maintenanceVehicles = vehicles.filter(v => v.nextMaintenance).length;
  const totalCost = vehicles.reduce((sum, v) => sum + v.dailyRate, 0);


  const handleVehicleFormChange = (field: string, value: string | Date | undefined) => {
    setVehicleForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefuelingFormChange = (field: string, value: string | number) => {
    setRefuelingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUsageFormChange = (field: string, value: string | number) => {
    setUsageForm(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Auto-populate start mileage with current vehicle mileage when vehicle is selected
      if (field === 'vehicle_id' && value) {
        const selectedVehicle = vehicles.find(v => v.id === value);
        if (selectedVehicle && !updated.start_mileage) {
          updated.start_mileage = selectedVehicle.currentMileage.toString();
        }
      }
      
      // Auto-calculate distance if both mileages are provided
      if ((field === 'start_mileage' || field === 'end_mileage') && 
          updated.start_mileage && updated.end_mileage) {
        const start = parseFloat(updated.start_mileage);
        const end = parseFloat(updated.end_mileage);
        if (!isNaN(start) && !isNaN(end) && end > start) {
          const distance = end - start;
          console.log(`Distance traveled: ${distance} km`);
        }
      }
      
      return updated;
    });
  };

  const handleRefuelingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const recordData = {
        vehicle_id: refuelingForm.vehicle_id,
        refueling_date: refuelingForm.refueling_date || new Date().toISOString().split('T')[0],
        mileage: parseFloat(refuelingForm.mileage) || 0,
        fuel_amount: parseFloat(refuelingForm.fuel_amount) || 0,
        fuel_cost: parseFloat(refuelingForm.fuel_cost) || 0,
        fuel_type: refuelingForm.fuel_type,
        station_name: refuelingForm.station_name,
        notes: refuelingForm.notes
      };
      
      await addRefuelingRecord(recordData);
      setRefuelingForm({
        vehicle_id: '',
        refueling_date: '',
        mileage: '',
        fuel_amount: '',
        fuel_cost: '',
        fuel_type: 'Diesel',
        station_name: '',
        notes: ''
      });
      setShowRefuelingModal(false);
    } catch (error) {
      console.error('Error adding refueling record:', error);
      alert('Error adding refueling record: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUsageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frontend validation
    const startMileage = parseFloat(usageForm.start_mileage);
    const endMileage = parseFloat(usageForm.end_mileage);
    
    if (!usageForm.start_mileage || isNaN(startMileage)) {
      alert('Please enter a valid start mileage');
      return;
    }
    
    if (!usageForm.end_mileage || isNaN(endMileage)) {
      alert('Please enter a valid end mileage');
      return;
    }
    
    if (startMileage < 0 || endMileage < 0) {
      alert('Mileage values must be positive');
      return;
    }
    
    if (endMileage <= startMileage) {
      alert(`End mileage (${endMileage}) must be greater than start mileage (${startMileage})`);
      return;
    }
    
    try {
      const recordData = {
        vehicle_id: usageForm.vehicle_id,
        usage_date: usageForm.usage_date || new Date().toISOString().split('T')[0],
        start_mileage: startMileage,
        end_mileage: endMileage,
        start_location: usageForm.start_location,
        end_location: usageForm.end_location,
        purpose: usageForm.purpose,
        driver_name: usageForm.driver_name,
        fuel_consumed: parseFloat(usageForm.fuel_consumed) || 0,
        notes: usageForm.notes
      };
      
      // Debug: Log the data being sent
      console.log('Submitting usage record:', recordData);
      console.log('Calculated distance:', endMileage - startMileage, 'km');
      
      await addUsageRecord(recordData);
      setUsageForm({
        vehicle_id: '',
        usage_date: '',
        start_mileage: '',
        end_mileage: '',
        start_location: '',
        end_location: '',
        purpose: '',
        driver_name: '',
        fuel_consumed: '',
        notes: ''
      });
      setShowUsageModal(false);
    } catch (error) {
      console.error('Error adding usage record:', error);
      alert('Error adding usage record: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      name: vehicle.name,
      type: vehicle.type,
      status: vehicle.status,
      location: vehicle.location,
      fuelLevel: vehicle.fuelLevel.toString(),
      nextMaintenance: vehicle.nextMaintenance,
      dailyRate: vehicle.dailyRate.toString(),
      operator: '',
      licensePlate: '',
      purchaseDate: undefined
    });
    setShowEditVehicleModal(true);
  };

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    try {
      const vehicleData = {
        name: vehicleForm.name,
        type: vehicleForm.type,
        status: vehicleForm.status,
        location: vehicleForm.location,
        fuel_level: parseInt(vehicleForm.fuelLevel) || 100,
        next_service_date: vehicleForm.nextMaintenance,
        purchase_price: parseFloat(vehicleForm.dailyRate) || 0,
        purchase_date: vehicleForm.purchaseDate || null
      };

      console.log('Updating vehicle data:', vehicleData);

      const response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (result.success) {
        setShowEditVehicleModal(false);
        setEditingVehicle(null);
        alert('Vehicle updated successfully!');
        window.location.reload();
      } else {
        alert('Error updating vehicle: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Error updating vehicle: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Delete response:', result);

      if (result.success) {
        alert('Vehicle deleted successfully!');
        window.location.reload();
      } else {
        alert('Error deleting vehicle: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Error deleting vehicle: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare vehicle data for API
      const vehicleData = {
        name: vehicleForm.name,
        type: vehicleForm.type,
        registration_number: vehicleForm.licensePlate,
        status: vehicleForm.status,
        location: vehicleForm.location,
        fuel_level: parseInt(vehicleForm.fuelLevel) || 100,
        next_service_date: vehicleForm.nextMaintenance,
        purchase_price: convertToBaseCurrency(parseFloat(vehicleForm.dailyRate) || 0), // Convert to base currency (INR)
        purchase_date: vehicleForm.purchaseDate || null
      };

      console.log('Submitting vehicle data:', vehicleData);

      // Submit to database using direct API call instead of mutation hook
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success) {
        // Reset form and close modal
        setVehicleForm({
          name: '',
          type: '',
          status: 'active',
          location: '',
          fuelLevel: '',
          nextMaintenance: '',
          dailyRate: '',
          operator: '',
          licensePlate: '',
          purchaseDate: undefined
        });
        setShowAddVehicleModal(false);
        
        // Show success message
        alert('Vehicle added successfully!');
        
        // Refresh the page to show the new vehicle
        window.location.reload();
      } else {
        alert('Error adding vehicle: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Error adding vehicle: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'refueling', label: 'Refueling', icon: Fuel },
    { id: 'usage', label: 'Usage', icon: MapPin },
    { id: 'maintenance', label: 'Maintenance', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'vehicle-analytics', label: 'Report', icon: BarChart3 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <PageTitle 
            title="Vehicle & Equipment Management" 
            subtitle="Manage your construction vehicles and equipment" 
          />
        </div>
      </div>

      {/* Loading State */}
      {vehiclesLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      )}

      {/* Error State */}
      {vehiclesError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Vehicles</h3>
              <p className="text-sm text-red-600 mt-1">{vehiclesError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info */}
      {!vehiclesLoading && !vehiclesError && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Database Connection Active</h3>
              <p className="text-sm text-blue-600 mt-1">
                Loaded {totalVehicles} vehicles from database. Active: {activeVehicles}, Maintenance: {maintenanceVehicles}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Vehicles</p>
              <p className="text-3xl font-bold text-gray-900">{vehiclesLoading ? '...' : totalVehicles}</p>
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
              <p className="text-3xl font-bold text-gray-900">{vehiclesLoading ? '...' : activeVehicles}</p>
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
              <p className="text-3xl font-bold text-gray-900">{vehiclesLoading ? '...' : maintenanceVehicles}</p>
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
              <p className="text-3xl font-bold text-gray-900">{vehiclesLoading ? '...' : formatCurrency(totalCost)}</p>
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
              {/* Overview Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vehicle Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Vehicles:</span>
                      <span className="font-semibold">{totalVehicles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active:</span>
                      <span className="font-semibold text-green-600">{activeVehicles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">In Maintenance:</span>
                      <span className="font-semibold text-yellow-600">{maintenanceVehicles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-semibold">{formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowAddVehicleModal(true)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Vehicle</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('vehicles')}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
                    >
                      <Truck className="h-4 w-4" />
                      <span>View All Vehicles</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('maintenance')}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Maintenance Schedule</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Vehicles */}
              {vehicles.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Vehicles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.slice(0, 6).map((vehicle) => (
                      <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Truck className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{vehicle.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{vehicle.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                            vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {vehicle.status}
                          </span>
                          <span className="text-sm text-gray-600">{formatCurrency(vehicle.dailyRate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {vehicles.length > 6 && (
                    <div className="mt-4 text-center">
                      <button 
                        onClick={() => setActiveTab('vehicles')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View All {totalVehicles} Vehicles →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {vehicles.length === 0 && (
                <div className="text-center py-12">
                  <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Found</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first vehicle or equipment.</p>
                  <button 
                    onClick={() => setShowAddVehicleModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Vehicle</span>
                  </button>
                </div>
              )}
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
                    <option value="concrete-mixer">Concrete Mixer</option>
                    <option value="bulldozer">Bulldozer</option>
                    <option value="generator">Generator</option>
                    <option value="loader">Loader</option>
                    <option value="compactor">Compactor</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="idle">Idle</option>
                  </select>
                </div>
                <button 
                  onClick={() => setShowAddVehicleModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>

              {/* Vehicle List */}
              {vehiclesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading vehicles...</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Found</h3>
                  <p className="text-gray-500">Add vehicles to start tracking your equipment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles
                    .filter(vehicle => {
                      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                          vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesTypeFilter = filterType === 'all' || vehicle.type === filterType;
                      const matchesStatusFilter = filterStatus === 'all' || vehicle.status === filterStatus;
                      return matchesSearch && matchesTypeFilter && matchesStatusFilter;
                    })
                    .map((vehicle) => (
                      <div key={vehicle.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Truck className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                              <p className="text-sm text-gray-600 capitalize">{vehicle.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                              vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {vehicle.status}
                            </span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleEditVehicle(vehicle)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit vehicle"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete vehicle"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{vehicle.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Fuel className="h-4 w-4" />
                            <span>Fuel: {vehicle.fuelLevel}%</span>
                          </div>
                          {vehicle.nextMaintenance && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Next Service: {new Date(vehicle.nextMaintenance).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Daily Rate</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(vehicle.dailyRate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'refueling' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Vehicle Refueling</h2>
                  <p className="text-gray-600">Track fuel consumption and refueling records</p>
                </div>
                <Button 
                  onClick={() => setShowRefuelingModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Refueling Record
                </Button>
              </div>

              {/* Refueling Records Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {refuelingRecords.map((record) => {
                        return (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(record.refueling_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.vehicle_name || 'Unknown Vehicle'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.mileage} km
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.fuel_amount} L
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(record.fuel_cost)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.station_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Vehicle Usage</h2>
                  <p className="text-gray-600">Track vehicle usage, routes, and mileage</p>
                </div>
                <Button 
                  onClick={() => setShowUsageModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Usage Record
                </Button>
              </div>

              {/* Usage Records Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usageRecords.map((record) => {
                        return (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(record.usage_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.vehicle_name || 'Unknown Vehicle'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div className="font-medium">{record.start_location}</div>
                                <div className="text-gray-500">→ {record.end_location}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.distance} km
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.driver_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.purpose}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Maintenance Schedule</h2>
                  <p className="text-gray-600">Track and manage vehicle maintenance schedules</p>
                </div>
                <button 
                  onClick={() => setShowAddVehicleModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>

              {/* Maintenance Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Overdue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {vehicles.filter(v => {
                          if (!v.nextMaintenance) return false;
                          const maintenanceDate = new Date(v.nextMaintenance);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          maintenanceDate.setHours(0, 0, 0, 0);
                          return maintenanceDate < today;
                        }).length}
                      </p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Due Soon</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {vehicles.filter(v => {
                          if (!v.nextMaintenance) return false;
                          const maintenanceDate = new Date(v.nextMaintenance);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          maintenanceDate.setHours(0, 0, 0, 0);
                          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                          return maintenanceDate >= today && maintenanceDate <= nextWeek;
                        }).length}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Up to Date</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {vehicles.filter(v => {
                          if (!v.nextMaintenance) return true;
                          const maintenanceDate = new Date(v.nextMaintenance);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          maintenanceDate.setHours(0, 0, 0, 0);
                          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                          return maintenanceDate > nextWeek;
                        }).length}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>


              {/* Maintenance List */}
              {vehiclesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading maintenance data...</p>
                </div>
              ) : vehicles.filter(v => v.nextMaintenance).length === 0 ? (
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Scheduled</h3>
                  <p className="text-gray-500">No vehicles have maintenance dates scheduled.</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Upcoming Maintenance</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vehicle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Next Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles
                          .filter(v => v.nextMaintenance)
                          .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
                          .map((vehicle) => {
                            const maintenanceDate = new Date(vehicle.nextMaintenance);
                            const today = new Date();
                            // Set time to start of day for accurate comparison
                            today.setHours(0, 0, 0, 0);
                            maintenanceDate.setHours(0, 0, 0, 0);
                            
                            const isOverdue = maintenanceDate < today;
                            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                            const isDueSoon = maintenanceDate >= today && maintenanceDate <= nextWeek;
                            
                            return (
                              <tr key={vehicle.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                      <Truck className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                                      <div className="text-sm text-gray-500">ID: {vehicle.id.slice(0, 8)}...</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900 capitalize">{vehicle.type}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {maintenanceDate.toLocaleDateString('en-GB')}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {isOverdue ? 'Overdue' : isDueSoon ? 'Due Soon' : 'Scheduled'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    isOverdue ? 'bg-red-100 text-red-800' :
                                    isDueSoon ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {isOverdue ? 'Overdue' : isDueSoon ? 'Due Soon' : 'Scheduled'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {vehicle.location}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleEditVehicle(vehicle)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Mark as completed - you can implement this functionality
                                        alert('Mark maintenance as completed - functionality to be implemented');
                                      }}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      Complete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}


          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Vehicle Analytics Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live Data</span>
                  </div>
                </div>
                <p className="text-gray-600">Comprehensive insights into vehicle performance, utilization, and costs.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Total Vehicles</h4>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-sm text-green-600">+3 this month</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Active Vehicles</h4>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                  <p className="text-sm text-green-600">75% utilization</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-yellow-500" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Maintenance Due</h4>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <p className="text-sm text-yellow-600">Next 30 days</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Monthly Cost</h4>
                  <p className="text-2xl font-bold text-gray-900">₹2.4L</p>
                  <p className="text-sm text-green-600">-8% vs last month</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vehicle Utilization Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Utilization</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'Excavators', utilization: 85, color: 'bg-blue-500' },
                      { name: 'Cranes', utilization: 72, color: 'bg-green-500' },
                      { name: 'Trucks', utilization: 90, color: 'bg-yellow-500' },
                      { name: 'Loaders', utilization: 68, color: 'bg-purple-500' },
                      { name: 'Bulldozers', utilization: 78, color: 'bg-red-500' }
                    ].map((vehicle, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{vehicle.name}</span>
                          <span className="text-sm text-gray-600">{vehicle.utilization}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${vehicle.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${vehicle.utilization}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cost Breakdown</h4>
                  <div className="space-y-4">
                    {[
                      { category: 'Fuel', amount: '₹1.2L', percentage: 50, color: 'bg-blue-500' },
                      { category: 'Maintenance', amount: '₹60K', percentage: 25, color: 'bg-green-500' },
                      { category: 'Insurance', amount: '₹40K', percentage: 17, color: 'bg-yellow-500' },
                      { category: 'Other', amount: '₹20K', percentage: 8, color: 'bg-purple-500' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{item.amount}</p>
                          <p className="text-xs text-gray-500">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-1">Average Uptime</h5>
                    <p className="text-2xl font-bold text-blue-600">94.2%</p>
                    <p className="text-sm text-gray-600">Last 30 days</p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Fuel className="h-8 w-8 text-white" />
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-1">Fuel Efficiency</h5>
                    <p className="text-2xl font-bold text-green-600">8.5L/hr</p>
                    <p className="text-sm text-gray-600">Average consumption</p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-1">ROI</h5>
                    <p className="text-2xl font-bold text-purple-600">18.5%</p>
                    <p className="text-sm text-gray-600">Return on investment</p>
                  </div>
                </div>
              </div>

              {/* Fuel Consumption Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fuel Consumption Trends */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Refueling Records</h4>
                  <div className="space-y-4">
                    {refuelingRecords.slice(0, 5).map((record, index) => {
                      const costPerLiter = record.fuel_amount > 0 ? record.fuel_cost / record.fuel_amount : 0;
                      
                      return (
                        <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{record.vehicle_name || 'Unknown Vehicle'}</span>
                            <span className="text-sm text-gray-600">{new Date(record.refueling_date).toLocaleDateString()}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Mileage:</span>
                              <div className="font-medium">{record.mileage} km</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Fuel:</span>
                              <div className="font-medium">{record.fuel_amount} L</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Cost/L:</span>
                              <div className="font-medium">{formatCurrency(costPerLiter)}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            Station: {record.station_name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Usage Analytics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Usage Records</h4>
                  <div className="space-y-4">
                    {usageRecords.slice(0, 5).map((record, index) => {
                      const fuelEfficiency = record.fuel_consumed > 0 ? record.distance / record.fuel_consumed : 0;
                      
                      return (
                        <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{record.vehicle_name || 'Unknown Vehicle'}</span>
                            <span className="text-sm text-gray-600">{new Date(record.usage_date).toLocaleDateString()}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Route:</span>
                              <span className="font-medium">{record.start_location} → {record.end_location}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Distance:</span>
                              <span className="font-medium">{record.distance} km</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Fuel Efficiency:</span>
                              <span className="font-medium">{fuelEfficiency.toFixed(1)} km/L</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Driver:</span>
                              <span className="font-medium">{record.driver_name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Purpose:</span>
                              <span className="font-medium">{record.purpose}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fuel Efficiency Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Fuel Efficiency Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {refuelingRecords.length > 0 ? 
                        (refuelingRecords.reduce((sum, r) => sum + r.fuel_amount, 0) / refuelingRecords.length).toFixed(1) : 0
                      } L
                    </div>
                    <div className="text-sm text-gray-600">Avg Fuel per Refill</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {usageRecords.length > 0 ? 
                        (usageRecords.reduce((sum, r) => sum + (r.distance / (r.fuel_consumed || 1)), 0) / usageRecords.length).toFixed(1) : 0
                      } km/L
                    </div>
                    <div className="text-sm text-gray-600">Avg Fuel Efficiency</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(refuelingRecords.reduce((sum, r) => sum + r.fuel_cost, 0))}
                    </div>
                    <div className="text-sm text-gray-600">Total Fuel Cost</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {usageRecords.reduce((sum, r) => sum + r.distance, 0)} km
                    </div>
                    <div className="text-sm text-gray-600">Total Distance</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  {[
                    { action: 'Maintenance completed', vehicle: 'Excavator E-001', time: '2 hours ago', status: 'success' },
                    { action: 'Fuel refill', vehicle: 'Truck T-005', time: '4 hours ago', status: 'info' },
                    { action: 'Maintenance scheduled', vehicle: 'Crane C-003', time: '1 day ago', status: 'warning' },
                    { action: 'Vehicle assigned', vehicle: 'Loader L-002', time: '2 days ago', status: 'success' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100' :
                        activity.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {activity.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : activity.status === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.vehicle}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Analytics Tab */}
          {activeTab === 'vehicle-analytics' && (
            <VehicleAnalytics />
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
                <p className="text-gray-600">Add a new vehicle or equipment to your fleet.</p>
              </div>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vehicleName" className="text-sm font-medium text-gray-700">
                      Vehicle Name
                    </Label>
                    <Input
                      id="vehicleName"
                      type="text"
                      value={vehicleForm.name}
                      onChange={(e) => handleVehicleFormChange('name', e.target.value)}
                      placeholder="e.g., Excavator-001"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="vehicleType" className="text-sm font-medium text-gray-700">
                      Vehicle Type
                    </Label>
                    <Select value={vehicleForm.type} onValueChange={(value) => handleVehicleFormChange('type', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excavator">Excavator</SelectItem>
                        <SelectItem value="crane">Crane</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="bulldozer">Bulldozer</SelectItem>
                        <SelectItem value="loader">Loader</SelectItem>
                        <SelectItem value="concrete-mixer">Concrete Mixer</SelectItem>
                        <SelectItem value="generator">Generator</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <Select value={vehicleForm.status} onValueChange={(value) => handleVehicleFormChange('status', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                      Current Location
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      value={vehicleForm.location}
                      onChange={(e) => handleVehicleFormChange('location', e.target.value)}
                      placeholder="e.g., Site A, Building 1"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="operator" className="text-sm font-medium text-gray-700">
                      Operator
                    </Label>
                    <Input
                      id="operator"
                      type="text"
                      value={vehicleForm.operator}
                      onChange={(e) => handleVehicleFormChange('operator', e.target.value)}
                      placeholder="Operator name"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="licensePlate" className="text-sm font-medium text-gray-700">
                      License Plate / ID
                    </Label>
                    <Input
                      id="licensePlate"
                      type="text"
                      value={vehicleForm.licensePlate}
                      onChange={(e) => handleVehicleFormChange('licensePlate', e.target.value)}
                      placeholder="e.g., MH-12-AB-1234"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fuelLevel" className="text-sm font-medium text-gray-700">
                      Fuel Level (%)
                    </Label>
                    <Input
                      id="fuelLevel"
                      type="number"
                      min="0"
                      max="100"
                      value={vehicleForm.fuelLevel}
                      onChange={(e) => handleVehicleFormChange('fuelLevel', e.target.value)}
                      placeholder="75"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dailyRate" className="text-sm font-medium text-gray-700">
                      Daily Rate ({units.currency.symbol})
                    </Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      value={vehicleForm.dailyRate}
                      onChange={(e) => handleVehicleFormChange('dailyRate', e.target.value)}
                      placeholder="5000"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nextMaintenance" className="text-sm font-medium text-gray-700">
                      Next Maintenance Date
                    </Label>
                    <div className="mt-1">
                      <DatePicker
                        value={parseDateFromInput(vehicleForm.nextMaintenance) || undefined}
                        onChange={(date) => handleVehicleFormChange('nextMaintenance', formatDateForInput(date))}
                        placeholder="Select maintenance date"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="purchaseDate" className="text-sm font-medium text-gray-700">
                      Purchase Date
                    </Label>
                    <div className="mt-1">
                      <DatePicker
                        value={vehicleForm.purchaseDate}
                        onChange={(date) => handleVehicleFormChange('purchaseDate', date)}
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
                  onClick={() => setShowAddVehicleModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Vehicle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditVehicleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit Vehicle</h2>
              <button
                onClick={() => setShowEditVehicleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateVehicle} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                      Vehicle Name
                    </Label>
                    <Input
                      id="edit-name"
                      type="text"
                      value={vehicleForm.name}
                      onChange={(e) => handleVehicleFormChange('name', e.target.value)}
                      placeholder="e.g., Excavator #1"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-type" className="text-sm font-medium text-gray-700">
                      Vehicle Type
                    </Label>
                    <select
                      id="edit-type"
                      value={vehicleForm.type}
                      onChange={(e) => handleVehicleFormChange('type', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="excavator">Excavator</option>
                      <option value="crane">Crane</option>
                      <option value="truck">Truck</option>
                      <option value="concrete-mixer">Concrete Mixer</option>
                      <option value="bulldozer">Bulldozer</option>
                      <option value="generator">Generator</option>
                      <option value="loader">Loader</option>
                      <option value="compactor">Compactor</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="edit-status" className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <select
                      id="edit-status"
                      value={vehicleForm.status}
                      onChange={(e) => handleVehicleFormChange('status', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="idle">Idle</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="edit-location" className="text-sm font-medium text-gray-700">
                      Current Location
                    </Label>
                    <Input
                      id="edit-location"
                      type="text"
                      value={vehicleForm.location}
                      onChange={(e) => handleVehicleFormChange('location', e.target.value)}
                      placeholder="e.g., Site A, Building 1"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-fuelLevel" className="text-sm font-medium text-gray-700">
                      Fuel Level (%)
                    </Label>
                    <Input
                      id="edit-fuelLevel"
                      type="number"
                      min="0"
                      max="100"
                      value={vehicleForm.fuelLevel}
                      onChange={(e) => handleVehicleFormChange('fuelLevel', e.target.value)}
                      placeholder="75"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-dailyRate" className="text-sm font-medium text-gray-700">
                      Daily Rate ({units.currency.symbol})
                    </Label>
                    <Input
                      id="edit-dailyRate"
                      type="number"
                      value={vehicleForm.dailyRate}
                      onChange={(e) => handleVehicleFormChange('dailyRate', e.target.value)}
                      placeholder="5000"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-nextMaintenance" className="text-sm font-medium text-gray-700">
                      Next Maintenance Date
                    </Label>
                    <div className="mt-1">
                      <DatePicker
                        value={parseDateFromInput(vehicleForm.nextMaintenance) || undefined}
                        onChange={(date) => handleVehicleFormChange('nextMaintenance', formatDateForInput(date))}
                        placeholder="Select maintenance date"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-purchaseDate" className="text-sm font-medium text-gray-700">
                      Purchase Date
                    </Label>
                    <div className="mt-1">
                      <DatePicker
                        value={vehicleForm.purchaseDate}
                        onChange={(date) => handleVehicleFormChange('purchaseDate', date)}
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
                  onClick={() => setShowEditVehicleModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Update Vehicle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refueling Modal */}
      {showRefuelingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Refueling Record</h2>
              <button
                onClick={() => setShowRefuelingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleRefuelingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vehicle_id">Vehicle</Label>
                  <Select
                    value={refuelingForm.vehicle_id}
                    onValueChange={(value) => handleRefuelingFormChange('vehicle_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="refueling_date">Date</Label>
                  <Input
                    id="refueling_date"
                    type="date"
                    value={refuelingForm.refueling_date}
                    onChange={(e) => handleRefuelingFormChange('refueling_date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={refuelingForm.mileage}
                    onChange={(e) => handleRefuelingFormChange('mileage', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fuel_amount">Fuel Amount (L)</Label>
                  <Input
                    id="fuel_amount"
                    type="number"
                    step="0.1"
                    value={refuelingForm.fuel_amount}
                    onChange={(e) => handleRefuelingFormChange('fuel_amount', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fuel_cost">Fuel Cost</Label>
                  <Input
                    id="fuel_cost"
                    type="number"
                    value={refuelingForm.fuel_cost}
                    onChange={(e) => handleRefuelingFormChange('fuel_cost', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fuel_type">Fuel Type</Label>
                  <Select
                    value={refuelingForm.fuel_type}
                    onValueChange={(value) => handleRefuelingFormChange('fuel_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="CNG">CNG</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="station_name">Fuel Station</Label>
                  <Input
                    id="station_name"
                    value={refuelingForm.station_name}
                    onChange={(e) => handleRefuelingFormChange('station_name', e.target.value)}
                    placeholder="Enter fuel station name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={refuelingForm.notes}
                    onChange={(e) => handleRefuelingFormChange('notes', e.target.value)}
                    placeholder="Additional notes (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRefuelingModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Refueling Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Usage Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Usage Record</h2>
              <button
                onClick={() => setShowUsageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUsageSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="usage_vehicle_id">Vehicle</Label>
                  <Select
                    value={usageForm.vehicle_id}
                    onValueChange={(value) => handleUsageFormChange('vehicle_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="usage_date">Date</Label>
                  <Input
                    id="usage_date"
                    type="date"
                    value={usageForm.usage_date}
                    onChange={(e) => handleUsageFormChange('usage_date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="start_mileage">Start Mileage (km)</Label>
                  <Input
                    id="start_mileage"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Enter starting mileage"
                    value={usageForm.start_mileage}
                    onChange={(e) => handleUsageFormChange('start_mileage', e.target.value)}
                    required
                  />
                  {usageForm.vehicle_id && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current vehicle mileage: {vehicles.find(v => v.id === usageForm.vehicle_id)?.currentMileage || 0} km
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="end_mileage">End Mileage (km)</Label>
                  <Input
                    id="end_mileage"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Enter ending mileage"
                    value={usageForm.end_mileage}
                    onChange={(e) => handleUsageFormChange('end_mileage', e.target.value)}
                    required
                  />
                  {usageForm.start_mileage && usageForm.end_mileage && (
                    <p className="text-xs text-blue-600 mt-1">
                      Distance: {parseFloat(usageForm.end_mileage) - parseFloat(usageForm.start_mileage)} km
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="start_location">Start Location</Label>
                  <Input
                    id="start_location"
                    value={usageForm.start_location}
                    onChange={(e) => handleUsageFormChange('start_location', e.target.value)}
                    placeholder="Starting location"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_location">End Location</Label>
                  <Input
                    id="end_location"
                    value={usageForm.end_location}
                    onChange={(e) => handleUsageFormChange('end_location', e.target.value)}
                    placeholder="Destination"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="driver_name">Driver</Label>
                  <Input
                    id="driver_name"
                    value={usageForm.driver_name}
                    onChange={(e) => handleUsageFormChange('driver_name', e.target.value)}
                    placeholder="Driver name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input
                    id="purpose"
                    value={usageForm.purpose}
                    onChange={(e) => handleUsageFormChange('purpose', e.target.value)}
                    placeholder="Purpose of trip"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fuel_consumed">Fuel Consumed (L)</Label>
                  <Input
                    id="fuel_consumed"
                    type="number"
                    step="0.1"
                    value={usageForm.fuel_consumed}
                    onChange={(e) => handleUsageFormChange('fuel_consumed', e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="usageNotes">Notes</Label>
                  <Input
                    id="usageNotes"
                    value={usageForm.notes}
                    onChange={(e) => handleUsageFormChange('notes', e.target.value)}
                    placeholder="Additional notes (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUsageModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Add Usage Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;