'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  Package,
  BarChart3,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import SiteDashboard from './SiteDashboard';
import SiteVehicles from './SiteVehicles';
import SiteMaterials from './SiteMaterials';
import SiteExpenses from './SiteExpenses';

const sites = [
  {
    id: 1,
    name: 'Commercial Complex Phase 1',
    location: 'Mumbai, Maharashtra',
    status: 'active',
    progress: 75,
    budget: 5000000,
    spent: 3750000,
    client: 'ABC Corp',
    manager: 'Rajesh Kumar',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    priority: 'high'
  },
  {
    id: 2,
    name: 'Residential Tower A',
    location: 'Delhi, NCR',
    status: 'active',
    progress: 45,
    budget: 8000000,
    spent: 3600000,
    client: 'XYZ Builders',
    manager: 'Priya Sharma',
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    priority: 'medium'
  },
  {
    id: 3,
    name: 'Industrial Warehouse',
    location: 'Pune, Maharashtra',
    status: 'on-hold',
    progress: 30,
    budget: 3000000,
    spent: 900000,
    client: 'DEF Industries',
    manager: 'Amit Patel',
    startDate: '2024-01-01',
    endDate: '2024-05-30',
    priority: 'low'
  },
  {
    id: 4,
    name: 'Shopping Mall Complex',
    location: 'Bangalore, Karnataka',
    status: 'completed',
    progress: 100,
    budget: 12000000,
    spent: 11500000,
    client: 'GHI Developers',
    manager: 'Suresh Reddy',
    startDate: '2023-08-01',
    endDate: '2024-01-31',
    priority: 'high'
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800'
};

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-orange-100 text-orange-800',
  low: 'bg-gray-100 text-gray-800'
};

export default function SiteManagement() {
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [siteForm, setSiteForm] = useState({
    siteName: 'Residential Complex A',
    location: 'Sector 15, Navi Mumbai',
    startDate: '',
    expectedEndDate: '',
    totalBudget: '50000000',
    projectManager: 'Rajesh Kumar',
    description: 'Premium residential complex with 200 units'
  });

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'vehicles', name: 'Vehicles', icon: Truck },
    { id: 'materials', name: 'Materials', icon: Package },
    { id: 'expenses', name: 'Expenses', icon: DollarSign }
  ];

  const handleFormInputChange = (field: string, value: string) => {
    setSiteForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the site data
    console.log('New site data:', siteForm);
    setShowAddModal(false);
    // Reset form
    setSiteForm({
      siteName: '',
      location: '',
      startDate: '',
      expectedEndDate: '',
      totalBudget: '',
      projectManager: '',
      description: ''
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Site Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and monitor all construction sites with integrated workflows</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Site</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Site List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Site Cards */}
          <div className="space-y-2">
            {filteredSites.map((site) => (
              <div
                key={site.id}
                onClick={() => setSelectedSite(site)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSite.id === site.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{site.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{site.location}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[site.status as keyof typeof statusColors]}`}>
                        {site.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[site.priority as keyof typeof priorityColors]}`}>
                        {site.priority}
                      </span>
                    </div>
                  </div>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{site.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${site.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Site Details with Tabs */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Site Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedSite.name}</h2>
                  <p className="text-gray-600">{selectedSite.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedSite.status as keyof typeof statusColors]}`}>
                    {selectedSite.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[selectedSite.priority as keyof typeof priorityColors]}`}>
                    {selectedSite.priority} priority
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Project Progress</span>
                  <span className="text-sm font-bold text-gray-900">{selectedSite.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedSite.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Budget</p>
                      <p className="text-sm font-bold text-gray-900">₹{(selectedSite.budget / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Spent</p>
                      <p className="text-sm font-bold text-gray-900">₹{(selectedSite.spent / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Client</p>
                      <p className="text-sm font-bold text-gray-900">{selectedSite.client}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Manager</p>
                      <p className="text-sm font-bold text-gray-900">{selectedSite.manager}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'dashboard' && <SiteDashboard site={selectedSite} />}
              {activeTab === 'vehicles' && <SiteVehicles site={selectedSite} />}
              {activeTab === 'materials' && <SiteMaterials site={selectedSite} />}
              {activeTab === 'expenses' && <SiteExpenses site={selectedSite} />}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Site Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Construction Site</h2>
                <p className="text-sm text-gray-600">Create a new construction project site</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddSite} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={siteForm.siteName}
                      onChange={(e) => handleFormInputChange('siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter site name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={siteForm.location}
                      onChange={(e) => handleFormInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={siteForm.startDate}
                        onChange={(e) => handleFormInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        style={{ colorScheme: 'light' }}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected End Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={siteForm.expectedEndDate}
                        onChange={(e) => handleFormInputChange('expectedEndDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        style={{ colorScheme: 'light' }}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={siteForm.totalBudget}
                      onChange={(e) => handleFormInputChange('totalBudget', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter total budget"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Manager
                    </label>
                    <input
                      type="text"
                      value={siteForm.projectManager}
                      onChange={(e) => handleFormInputChange('projectManager', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter project manager name"
                    />
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={siteForm.description}
                  onChange={(e) => handleFormInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter project description"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
