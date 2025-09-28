'use client';

import { useState, useEffect } from 'react';
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
  ChevronDown,
  AlertTriangle,
  PieChart,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useMaterials, useSites } from '@/hooks/useApi';
import { formatDateForInput } from '@/lib/dateUtils';
import { useUnits } from '@/contexts/UnitContext';
import { ReportGenerator, processReportData } from '@/lib/reportGenerator';
import PageTitle from './PageTitle';

// Dummy materials array removed - now using real data from API

// Dummy purchaseHistory array removed - now using real data from API

// Dummy periodicEntries array removed - now using real data from API

// Dummy vendors array removed - now using real data from API

// Dummy sites array removed - now using real data from API

const tabs = [
  { id: 'inventory', name: 'Current Inventory', icon: Package },
  { id: 'purchase', name: 'Purchase History', icon: ShoppingCart },
  { id: 'reports', name: 'Reports & Export', icon: FileText },
  { id: 'vendor', name: 'Vendor Summary', icon: Users },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 }
];

function MaterialManagement() {
  const { data: materialsData, loading: materialsLoading, error: materialsError } = useMaterials();
  const { data: sitesData, loading: sitesLoading, error: sitesError } = useSites();
  const { formatCurrency, formatWeight, formatVolume, formatDistance, formatArea, units, convertToBaseCurrency } = useUnits();
  
  // API mutations for creating materials - using direct fetch instead of useApiMutation
  const [activeTab, setActiveTab] = useState('inventory');
  const [viewMode, setViewMode] = useState('overall');
  const [selectedSite, setSelectedSite] = useState('All Sites');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showConsumptionModal, setShowConsumptionModal] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    materialName: '',
    site: '',
    category: 'other',
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
  

  // Report form states
  const [customReportForm, setCustomReportForm] = useState({
    fromDate: '',
    toDate: '',
    reportType: '',
    siteFilter: 'All sites'
  });

  const [monthlyReportForm, setMonthlyReportForm] = useState({
    month: '',
    reportFormat: '',
    includeCharts: 'Yes'
  });

  // Use real data from API
  const realMaterials = (materialsData as any[]) || [];
  
  const totalMaterials = realMaterials.length;
  const stockValue = realMaterials.reduce((sum, material) => sum + (material.cost_per_unit * material.quantity || 0), 0);
  const totalPurchases = 0; // Will be calculated from real purchase data when available
  const lowStockItems = realMaterials.filter(material => material.quantity < 10).length;

  const materialUnits = ['Bags', 'Kilograms', 'Cubic Meters', 'Tons', 'Pieces'];

  // Helper function to format material quantity with unit conversion
  const formatMaterialQuantity = (quantity: number, unit: string) => {
    const quantityNum = parseFloat(quantity?.toString() || '0');
    
    // Determine the type of unit and apply appropriate conversion
    if (unit?.toLowerCase().includes('kilogram') || unit?.toLowerCase().includes('kg')) {
      return formatWeight(quantityNum);
    } else if (unit?.toLowerCase().includes('cubic') || unit?.toLowerCase().includes('meter')) {
      return formatVolume(quantityNum);
    } else if (unit?.toLowerCase().includes('meter') && !unit?.toLowerCase().includes('cubic')) {
      return formatDistance(quantityNum);
    } else if (unit?.toLowerCase().includes('square')) {
      return formatArea(quantityNum);
    } else {
      // For other units (pieces, bags, tons), just format the number
      return `${quantityNum.toLocaleString()} ${unit}`;
    }
  };

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




  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare material data for API
      const materialData = {
        name: purchaseForm.materialName,
        category: purchaseForm.category, // Use selected category from form
        quantity: parseFloat(purchaseForm.quantity) || 0,
        unit: purchaseForm.unit,
        cost_per_unit: convertToBaseCurrency(parseFloat(purchaseForm.unitRate) || 0), // Convert to base currency (INR)
        supplier_id: null, // You can map vendor name to ID if needed
        site_id: null, // You can map site name to ID if needed
        purchase_date: purchaseForm.purchaseDate || null,
        min_threshold: 10,
        quality_grade: 'Standard',
        batch_number: purchaseForm.invoiceNumber
      };

      console.log('Submitting material data:', materialData);

      // Submit to database using direct API call instead of mutation hook
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });

      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success) {
        setShowPurchaseModal(false);
        // Reset form
        setPurchaseForm({
          materialName: '',
          site: '',
          category: 'other',
          quantity: '100',
          unit: '',
          unitRate: '425',
          vendor: '',
          invoiceNumber: 'INV-2024-001',
          purchaseDate: undefined
        });
        
        // Show success message
        alert('Material purchase recorded successfully!');
        
        // Refresh the page to show the new material
        window.location.reload();
      } else {
        alert('Error recording purchase: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error recording purchase:', error);
      alert('Error recording purchase: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
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

  // Report generation handlers
  const handleGeneratePDFReport = async () => {
    try {
      if (!customReportForm.fromDate || !customReportForm.toDate) {
        alert('Please select both from and to dates');
        return;
      }

      // Fetch data
      const materials = await processReportData.getMaterialsData(
        customReportForm.siteFilter !== 'All sites' ? customReportForm.siteFilter : undefined, 
        { from: customReportForm.fromDate, to: customReportForm.toDate }
      );
      const expenses = await processReportData.getExpensesData(
        customReportForm.siteFilter !== 'All sites' ? customReportForm.siteFilter : undefined, 
        { from: customReportForm.fromDate, to: customReportForm.toDate }
      );
      const vehicles = await processReportData.getVehiclesData(
        customReportForm.siteFilter !== 'All sites' ? customReportForm.siteFilter : undefined
      );
      const labour = await processReportData.getLabourData(
        customReportForm.siteFilter !== 'All sites' ? customReportForm.siteFilter : undefined
      );
      
      // Calculate summary
      const summary = processReportData.calculateSummary(materials, expenses, vehicles, labour);
      
      // Generate report
      const reportGenerator = new ReportGenerator();
      const reportData = {
        title: `${customReportForm.reportType || 'Construction'} Report`,
        dateRange: { from: customReportForm.fromDate, to: customReportForm.toDate },
        site: customReportForm.siteFilter !== 'All sites' ? customReportForm.siteFilter : undefined,
        materials,
        expenses,
        vehicles,
        labour,
        summary
      };
      
      reportGenerator.generatePDFReport(reportData);
      alert('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const handleDownloadMonthlyReport = async () => {
    try {
      if (!monthlyReportForm.month) {
        alert('Please select a month');
        return;
      }

      // Fetch data for the month
      const materials = await processReportData.getMaterialsData(undefined, { from: `${monthlyReportForm.month}-01`, to: `${monthlyReportForm.month}-31` });
      const expenses = await processReportData.getExpensesData(undefined, { from: `${monthlyReportForm.month}-01`, to: `${monthlyReportForm.month}-31` });
      const vehicles = await processReportData.getVehiclesData();
      const labour = await processReportData.getLabourData();
      
      // Calculate summary
      const summary = processReportData.calculateSummary(materials, expenses, vehicles, labour);
      
      // Generate report
      const reportGenerator = new ReportGenerator();
      const reportData = {
        title: `Monthly Report - ${monthlyReportForm.month}`,
        month: monthlyReportForm.month,
        materials,
        expenses,
        vehicles,
        labour,
        summary
      };
      
      reportGenerator.generatePDFReport(reportData);
      alert('Monthly report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading monthly report:', error);
      alert('Error downloading monthly report. Please try again.');
    }
  };


  // Report form handlers
  const handleCustomReportFormChange = (field: string, value: string) => {
    setCustomReportForm(prev => ({ ...prev, [field]: value }));
  };

  const handleMonthlyReportFormChange = (field: string, value: string) => {
    setMonthlyReportForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadReport = async (reportName: string) => {
    try {
      // Fetch all data
      const materials = await processReportData.getMaterialsData();
      const expenses = await processReportData.getExpensesData();
      const vehicles = await processReportData.getVehiclesData();
      const labour = await processReportData.getLabourData();
      
      // Calculate summary
      const summary = processReportData.calculateSummary(materials, expenses, vehicles, labour);
      
      // Generate report
      const reportGenerator = new ReportGenerator();
      const reportData = {
        title: reportName,
        materials,
        expenses,
        vehicles,
        labour,
        summary
      };
      
      reportGenerator.generatePDFReport(reportData);
      alert(`${reportName} downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report. Please try again.');
    }
  };

  const handleViewReport = (reportName: string) => {
    alert(`Viewing ${reportName}... Feature coming soon!`);
  };

  const renderCurrentInventory = () => {
    if (viewMode === 'site') {
      // Group materials by site for Site-Based View
         const materialsBySite = realMaterials.reduce((acc, material) => {
        const siteName = material.site_id || 'Unknown Site';
        if (!acc[siteName]) {
          acc[siteName] = [];
        }
        acc[siteName].push(material);
        return acc;
      }, {} as Record<string, typeof realMaterials>);

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
              const totalValue = (siteMaterials as any[]).reduce((sum, material) => sum + (material.cost_per_unit * material.quantity || 0), 0);
              const materialCount = (siteMaterials as any[]).length;

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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Unit Cost</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(siteMaterials as any[]).map((material) => (
                          <tr key={material.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{material.name}</div>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                               {formatMaterialQuantity(material.quantity || 0, material.unit || '')}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                               {formatCurrency(material.cost_per_unit || 0)}/{material.unit || ''}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                               {formatCurrency((material.cost_per_unit || 0) * (material.quantity || 0))}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                 Available
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Unit Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {realMaterials.map((material) => (
                <tr key={material.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                       <div className="text-sm text-gray-500 flex items-center">
                         <MapPin className="h-3 w-3 mr-1" />
                         Site ID: {material.site_id || 'N/A'}
                       </div>
                    </div>
                  </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                       {formatMaterialQuantity(material.quantity || 0, material.unit || '')}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                       {formatMaterialQuantity(0, material.unit || '')}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div>
                         <div className="text-sm text-gray-900">{formatMaterialQuantity(material.quantity || 0, material.unit || '')}</div>
                         <div className="text-xs text-gray-500">
                           100% available
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                       {formatCurrency(material.cost_per_unit || 0)}/{material.unit || ''}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                       {formatCurrency((material.cost_per_unit || 0) * (material.quantity || 0))}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                         Available
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
      
      {materialsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading purchase history...</p>
        </div>
      ) : materialsError ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading purchase history: {materialsError}</p>
        </div>
      ) : !materialsData || (materialsData as any[]).length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase History</h3>
          <p className="text-gray-500">No material purchases have been recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material & Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight/Quantity Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Unit Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Grade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(materialsData as any[])
                .sort((a, b) => new Date(b.purchase_date || b.created_at).getTime() - new Date(a.purchase_date || a.created_at).getTime())
                .map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {material.category}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatMaterialQuantity(material.quantity || 0, material.unit || '')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(parseFloat(material.cost_per_unit || 0))}/{material.unit || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(parseFloat(material.quantity || 0) * parseFloat(material.cost_per_unit || 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.purchase_date ? new Date(material.purchase_date).toLocaleDateString('en-GB') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.batch_number || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.quality_grade || 'Standard'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Removed renderPeriodicEntry function

  const renderReportsExport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Reports & Export</h3>
        <button 
          onClick={handleGeneratePDFReport}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
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
                  value={customReportForm.fromDate}
                  onChange={(e) => handleCustomReportFormChange('fromDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={customReportForm.toDate}
                  onChange={(e) => handleCustomReportFormChange('toDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select 
                value={customReportForm.reportType}
                onChange={(e) => handleCustomReportFormChange('reportType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose report type</option>
                <option value="Material Inventory">Material Inventory</option>
                <option value="Purchase History">Purchase History</option>
                <option value="Consumption Report">Consumption Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Filter (Optional)</label>
              <select 
                value={customReportForm.siteFilter}
                onChange={(e) => handleCustomReportFormChange('siteFilter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All sites">All sites</option>
                {(sitesData as any[])?.map((site: any) => (
                  <option key={site.id} value={site.name}>{site.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleGeneratePDFReport}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
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
                type="month"
                value={monthlyReportForm.month}
                onChange={(e) => handleMonthlyReportFormChange('month', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
              <select 
                value={monthlyReportForm.reportFormat}
                onChange={(e) => handleMonthlyReportFormChange('reportFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose format</option>
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Include Charts</label>
              <select 
                value={monthlyReportForm.includeCharts}
                onChange={(e) => handleMonthlyReportFormChange('includeCharts', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <button 
              onClick={handleDownloadMonthlyReport}
              className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
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
                    <button 
                      onClick={() => handleDownloadReport('Material Inventory Summary')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleViewReport('Material Inventory Summary')}
                      className="text-gray-600 hover:text-gray-700"
                    >
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
      
      {sitesLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor data...</p>
        </div>
      ) : sitesError ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading vendor data: {sitesError}</p>
        </div>
      ) : !sitesData || (sitesData as any[]).length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Vendors Found</h3>
          <p className="text-gray-500">No vendors have been registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(sitesData as any[]).map((site) => (
            <div key={site.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{site.name}</h4>
                <div className="p-2 bg-blue-100 rounded-full">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium text-gray-900">{site.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    site.status === 'active' ? 'bg-green-100 text-green-800' :
                    site.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    site.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {site.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <span className="text-sm font-medium text-gray-900">{site.progress || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Budget:</span>
                  <span className="text-sm font-medium text-gray-900">₹{parseFloat(site.budget || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Spent:</span>
                  <span className="text-sm font-medium text-gray-900">₹{parseFloat(site.spent || 0).toLocaleString()}</span>
                </div>
                {site.start_date && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Start Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(site.start_date).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => {
    // Sample data for analytics
    const materialCategories = [
      { name: 'Cement', value: 2500000, percentage: 35, color: 'bg-blue-500' },
      { name: 'Steel', value: 1800000, percentage: 25, color: 'bg-gray-500' },
      { name: 'Bricks', value: 1200000, percentage: 17, color: 'bg-orange-500' },
      { name: 'Concrete', value: 1000000, percentage: 14, color: 'bg-yellow-500' },
      { name: 'Other', value: 500000, percentage: 9, color: 'bg-green-500' }
    ];

    const siteMaterialValues = [
      { site: 'BRL Tower', value: 3200000, percentage: 45 },
      { site: 'Ranchi Complex', value: 2500000, percentage: 35 },
      { site: 'Test Site Fixed', value: 1400000, percentage: 20 }
    ];

    const monthlyTrends = [
      { month: 'Jan', purchases: 1200000, usage: 800000 },
      { month: 'Feb', purchases: 1500000, usage: 1200000 },
      { month: 'Mar', purchases: 1800000, usage: 1500000 },
      { month: 'Apr', purchases: 2000000, usage: 1800000 },
      { month: 'May', purchases: 2200000, usage: 2000000 },
      { month: 'Jun', purchases: 2500000, usage: 2200000 }
    ];

    return (
      <div className="space-y-6">
        {/* Analytics Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Material Analytics Dashboard</h3>
              <p className="text-gray-600">Comprehensive insights into material inventory and usage</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
              <Button 
                onClick={() => {
                  const data = {
                    totalInventory: formatCurrency(7000000),
                    categories: materialCategories,
                    sites: siteMaterialValues,
                    trends: monthlyTrends,
                    date: new Date().toLocaleDateString()
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `material_analytics_${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(7000000)}</p>
              <p className="text-sm text-green-600">+15.2% vs last month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(2500000)}</p>
              <p className="text-sm text-green-600">+8.3% vs last month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Usage Rate</p>
              <p className="text-2xl font-bold text-gray-900">88%</p>
              <p className="text-sm text-green-600">+2.1% vs last month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-yellow-600">Need restocking</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Material Category Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Material Category Distribution</h4>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{
                  background: `conic-gradient(from 0deg, #3b82f6 0deg 126deg, #6b7280 126deg 216deg, #f97316 216deg 270deg, #eab308 270deg 320deg, #10b981 320deg 360deg)`
                }}></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {materialCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${category.color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{category.percentage}%</div>
                    <div className="text-xs text-gray-500">{formatCurrency(category.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Site-wise Material Value */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Site-wise Material Value</h4>
              <BarChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {siteMaterialValues.map((site, index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{site.site}</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(site.value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${colors[index]} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${site.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">{site.percentage}% of total</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Monthly Purchase vs Usage Trends</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Purchases</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Usage</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between px-4">
            {monthlyTrends.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="flex flex-col space-y-1">
                  <div 
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${(data.purchases / 3000000) * 200}px` }}
                    title={`Purchases: ${formatCurrency(data.purchases)}`}
                  ></div>
                  <div 
                    className="w-8 bg-green-500 rounded-b"
                    style={{ height: `${(data.usage / 3000000) * 200}px` }}
                    title={`Usage: ${formatCurrency(data.usage)}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Materials */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Top Materials by Value</h4>
          <div className="space-y-4">
            {[
              { name: 'Cement (OPC 53 Grade)', value: 2500000, quantity: '500 bags', trend: '+12%' },
              { name: 'Steel TMT Bars', value: 1800000, quantity: '25 tons', trend: '+8%' },
              { name: 'Red Bricks', value: 1200000, quantity: '10000 pieces', trend: '+15%' },
              { name: 'Ready Mix Concrete', value: 1000000, quantity: '50 m³', trend: '+5%' },
              { name: 'Sand (Fine)', value: 500000, quantity: '100 m³', trend: '+3%' }
            ].map((material, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{material.name}</p>
                    <p className="text-sm text-gray-600">{material.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(material.value)}</p>
                  <p className="text-sm text-green-600">{material.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (materialsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading materials...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (materialsError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600">Error loading materials: {materialsError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Company Title */}
      <div className="text-center mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Gavith Construction Pvt. Ltd.</h1>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <PageTitle 
            title="Material Management" 
            subtitle="Global overview of inventory across all construction sites" 
          />
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
            <span>New Purchase</span>
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
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category
                    </Label>
                    <Select value={purchaseForm.category} onValueChange={(value) => handlePurchaseInputChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cement">Cement</SelectItem>
                        <SelectItem value="steel">Steel</SelectItem>
                        <SelectItem value="bricks">Bricks</SelectItem>
                        <SelectItem value="sand">Sand</SelectItem>
                        <SelectItem value="aggregate">Aggregate</SelectItem>
                        <SelectItem value="tiles">Tiles</SelectItem>
                        <SelectItem value="paint">Paint</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                        {(sitesData as any[])?.map((site: any) => (
                          <SelectItem key={site.id} value={site.name}>{site.name}</SelectItem>
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
                        {materialUnits.map((unit) => (
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
                    {realMaterials.map((material) => (
                      <SelectItem key={material.id} value={material.id.toString()}>
                        {material.name} - Site ID: {material.site_id || 'N/A'} (Available: {formatMaterialQuantity(material.quantity || 0, material.unit || '')})
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

export default MaterialManagement;