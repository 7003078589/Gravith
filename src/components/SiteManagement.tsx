'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  FileText,
  Calendar as CalendarIcon,
  Package,
  Truck,
  Receipt,
  Users,
  BarChart3,
  Plus,
  CheckCircle,
  Upload,
  Eye,
  Download,
  FileIcon,
  Target,
  Zap,
  Activity,
  BarChart,
  Box,
  Fuel,
  Wrench,
  UserPlus,
  Phone,
  PieChart,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Site } from '@/types';
import { useSiteVehicle } from '@/contexts/SiteVehicleContext';
import { useSites, useMaterials, useVehicles, useExpenses, useLabour } from '@/hooks/useApi';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'scheduling', label: 'Scheduling', icon: CalendarIcon },
  { id: 'materials', label: 'Materials', icon: Package },
  { id: 'vehicles', label: 'Vehicles', icon: Truck },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'labour', label: 'Labour', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
];

// Mock data for documents
const mockDocuments = [
  {
    id: '1',
    name: 'Site Plan Drawing',
    type: 'drawings',
    size: '2.5 MB',
    uploadDate: '2024-01-15',
    uploadedBy: 'Rajesh Kumar'
  },
  {
    id: '2',
    name: 'Foundation Plan',
    type: 'plans',
    size: '1.8 MB',
    uploadDate: '2024-01-18',
    uploadedBy: 'Rajesh Kumar'
  }
];

const documentTypes = [
  { value: 'drawings', label: 'Site Drawings' },
  { value: 'plans', label: 'Building Plans' },
  { value: 'permits', label: 'Permits' },
  { value: 'contracts', label: 'Contracts' },
  { value: 'reports', label: 'Reports' },
  { value: 'other', label: 'Other' }
];

// Mock data for scheduling
const mockActivities = [
  {
    id: '1',
    name: 'Site Preparation',
    description: 'Clear site, set up temporary facilities, survey',
    assignedTo: 'Site Team A',
    progress: 100,
    status: 'completed',
    priority: 'high',
    category: 'Foundation',
    startDate: '2024-01-15',
    endDate: '2024-01-25',
    duration: 10,
    isMilestone: false
  },
  {
    id: '2',
    name: 'Foundation Excavation',
    description: 'Excavate foundation as per drawings',
    assignedTo: 'Foundation Team',
    progress: 100,
    status: 'completed',
    priority: 'critical',
    category: 'Foundation',
    startDate: '2024-01-26',
    endDate: '2024-02-05',
    duration: 10,
    isMilestone: false
  },
  {
    id: '3',
    name: 'Foundation Concrete',
    description: 'Pour foundation concrete and curing',
    assignedTo: 'Concrete Team',
    progress: 85,
    status: 'in-progress',
    priority: 'critical',
    category: 'Foundation',
    startDate: '2024-02-06',
    endDate: '2024-02-20',
    duration: 14,
    isMilestone: true
  },
  {
    id: '4',
    name: 'Column Construction',
    description: 'Construct ground floor columns',
    assignedTo: 'Structure Team',
    progress: 0,
    status: 'not-started',
    priority: 'high',
    category: 'Structure',
    startDate: '2024-02-21',
    endDate: '2024-03-10',
    duration: 18,
    isMilestone: false
  },
  {
    id: '5',
    name: 'First Floor Slab',
    description: 'Cast first floor slab',
    assignedTo: 'Structure Team',
    progress: 0,
    status: 'not-started',
    priority: 'high',
    category: 'Structure',
    startDate: '2024-03-11',
    endDate: '2024-03-25',
    duration: 14,
    isMilestone: true
  }
];

// Mock data for milestones
const mockMilestones = [
  {
    id: '1',
    name: 'Foundation Complete',
    description: 'Foundation work completed and approved',
    targetDate: '2024-02-20',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Ground Floor Complete',
    description: 'Ground floor structure completed',
    targetDate: '2024-03-25',
    status: 'pending'
  }
];

// Mock data for materials
// Materials data will be fetched from API

// Vehicles data will be fetched from API

const vehicleTypes = [
  { value: 'excavator', label: 'Excavator' },
  { value: 'crane', label: 'Crane' },
  { value: 'truck', label: 'Truck' },
  { value: 'concrete-mixer', label: 'Concrete Mixer' },
  { value: 'jcb', label: 'JCB' },
  { value: 'loader', label: 'Loader' },
  { value: 'compactor', label: 'Compactor' },
  { value: 'generator', label: 'Generator' },
  { value: 'other', label: 'Other' }
];

// Mock data for expenses
// Expenses and Labour data will be fetched from API

const expenseCategories = [
  { value: 'labour', label: 'Labour' },
  { value: 'materials', label: 'Materials' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' }
];

const skillCategories = [
  { value: 'mason', label: 'Mason' },
  { value: 'helper', label: 'Helper' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'painter', label: 'Painter' },
  { value: 'welder', label: 'Welder' },
  { value: 'other', label: 'Other' }
];

// Analytics data
const analyticsData = {
  materials: {
    totalInvestment: 680000, // ₹6.8L
    icon: Box,
    description: 'Total investment'
  },
  vehicles: {
    equipmentCost: 3680000, // ₹36.8L
    icon: Truck,
    description: 'Equipment cost'
  },
  labour: {
    wagesOwed: 64000, // ₹0.6L
    icon: Users,
    description: 'Wages owed'
  },
  totalExpenses: {
    allCategories: 210000, // ₹2.1L
    icon: DollarSign,
    description: 'All categories'
  }
};

// Expense distribution data for pie chart
const expenseDistribution = [
  { category: 'Labour', percentage: 60, amount: 126000, color: 'bg-blue-500' },
  { category: 'Equipment', percentage: 40, amount: 84000, color: 'bg-green-500' }
];

// Cost breakdown data for bar chart
const costBreakdown = [
  { category: 'Materials', amount: 600000, maxAmount: 3800000 },
  { category: 'Vehicles', amount: 3800000, maxAmount: 3800000 },
  { category: 'Labour', amount: 100000, maxAmount: 3800000 },
  { category: 'Other Expenses', amount: 150000, maxAmount: 3800000 }
];

const activityCategories = [
  { value: 'foundation', label: 'Foundation' },
  { value: 'structure', label: 'Structure' },
  { value: 'mep', label: 'MEP' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'external', label: 'External' }
];

const priorityLevels = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

const schedulingViews = [
  { id: 'gantt', label: 'Gantt Chart' },
  { id: 'timeline', label: 'Timeline View' },
  { id: 'critical', label: 'Critical Path' }
];

export default function SiteManagement() {
  const { data: sites, loading: sitesLoading, error: sitesError } = useSites();
  const { data: materials, loading: materialsLoading, error: materialsError } = useMaterials();
  const { data: vehicles, loading: vehiclesLoading, error: vehiclesError } = useVehicles();
  const { data: expenses, loading: expensesLoading, error: expensesError } = useExpenses();
  const { data: labour, loading: labourLoading, error: labourError } = useLabour();
  const sitesData = (sites as any[]) || [];
  const materialsData = (materials as any[]) || [];
  const vehiclesData = (vehicles as any[]) || [];
  const expensesData = (expenses as any[]) || [];
  const labourData = (labour as any[]) || [];
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Set first site as selected when data loads
  React.useEffect(() => {
    if (sitesData && sitesData.length > 0 && !selectedSite) {
      setSelectedSite(sitesData[0]);
    }
  }, [sitesData, selectedSite]);
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  
  // Use shared context for vehicle-site interconnections
  const {
    selectedSite: contextSelectedSite,
    setSelectedSite: setContextSelectedSite,
    getSiteVehicleExpenses,
    totalVehicleExpenses
  } = useSiteVehicle();
  
  // Shared state for form interconnections
  const [sharedData, setSharedData] = useState({
    totalSiteExpenses: 0,
    availableVendors: ['City Transport Services', 'Power Solutions Inc', 'ABC Suppliers', 'XYZ Materials'],
    availableSuppliers: ['Cement Corp', 'Steel Suppliers Ltd', 'Aggregate Co', 'Sand Suppliers'],
    skillCategories: ['Excavator Operator', 'Crane Operator', 'Electrician', 'Plumber', 'Mason', 'Helper'],
    materialCategories: ['cement', 'steel', 'bricks', 'sand', 'aggregate', 'other'],
    vehicleTypes: ['excavator', 'crane', 'truck', 'concrete-mixer', 'bulldozer', 'generator']
  });

  // State for material cost calculation
  const [materialCostCalculation, setMaterialCostCalculation] = useState({
    estimatedCost: 0,
    isCalculated: false
  });

  // Form interconnection functions
  const updateTotalExpenses = (amount: number) => {
    setSharedData(prev => ({
      ...prev,
      totalSiteExpenses: prev.totalSiteExpenses + amount
    }));
  };

  const getSuggestedMaterials = (activityCategory: string) => {
    const suggestions: { [key: string]: string[] } = {
      'foundation': ['cement', 'steel', 'aggregate'],
      'concrete': ['cement', 'sand', 'aggregate'],
      'electrical': ['steel', 'other'],
      'plumbing': ['steel', 'other'],
      'finishing': ['cement', 'sand', 'bricks']
    };
    return suggestions[activityCategory.toLowerCase()] || [];
  };

  const getSuggestedVehicles = (activityCategory: string) => {
    const suggestions: { [key: string]: string[] } = {
      'excavation': ['excavator', 'bulldozer'],
      'concrete': ['concrete-mixer', 'crane'],
      'transport': ['truck'],
      'lifting': ['crane'],
      'general': ['generator']
    };
    return suggestions[activityCategory.toLowerCase()] || [];
  };

  const getSuggestedSkills = (activityCategory: string) => {
    const suggestions: { [key: string]: string[] } = {
      'excavation': ['Excavator Operator'],
      'concrete': ['Mason', 'Helper'],
      'electrical': ['Electrician'],
      'plumbing': ['Plumber'],
      'lifting': ['Crane Operator'],
      'general': ['Helper', 'Mason']
    };
    return suggestions[activityCategory.toLowerCase()] || [];
  };

  const autoCalculateVehicleCosts = () => {
    const rental = parseFloat(vehicleForm.rentalCostPerDay) || 0;
    const fuel = parseFloat(vehicleForm.fuelCostPerDay) || 0;
    const startDate = new Date(vehicleForm.startDate);
    const endDate = new Date(vehicleForm.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 0;
    return (rental + fuel) * days;
  };

  // Timeline synchronization functions
  const validateDateWithinSitePeriod = (date: string, fieldName: string) => {
    if (!date || !selectedSite?.startDate || !selectedSite?.endDate) return true;
    
    const inputDate = new Date(date);
    const siteStart = new Date(selectedSite!.startDate);
    const siteEnd = new Date(selectedSite!.endDate);
    
    if (inputDate < siteStart || inputDate > siteEnd) {
      console.log(`Warning: ${fieldName} date (${date}) is outside site period (${selectedSite!.startDate} to ${selectedSite!.endDate})`);
      return false;
    }
    return true;
  };

  const syncActivityDatesWithVehicleRental = (activityStartDate: string, activityDuration: number) => {
    if (!activityStartDate || !activityDuration) return;
    
    const startDate = new Date(activityStartDate);
    const endDate = new Date(startDate.getTime() + (activityDuration * 24 * 60 * 60 * 1000));
    
    console.log(`Syncing vehicle rental period for activity: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
    
    // Auto-populate vehicle form dates if empty
    if (!vehicleForm.startDate) {
      setVehicleForm(prev => ({ ...prev, startDate: startDate.toISOString().split('T')[0] }));
    }
    if (!vehicleForm.endDate) {
      setVehicleForm(prev => ({ ...prev, endDate: endDate.toISOString().split('T')[0] }));
    }
  };

  const syncLabourJoinDateWithActivity = (activityStartDate: string) => {
    if (!activityStartDate) return;
    
    console.log(`Syncing labour join date with activity start: ${activityStartDate}`);
    
    // Auto-populate labour join date if empty
    if (!labourForm.joinDate) {
      setLabourForm(prev => ({ ...prev, joinDate: activityStartDate }));
    }
  };

  const [siteForm, setSiteForm] = useState({
    siteName: '',
    location: '',
    startDate: '',
    expectedEndDate: '',
    totalBudget: '',
    projectManager: '',
    description: ''
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: '',
    file: null as File | null
  });
  
  // Scheduling state
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [schedulingView, setSchedulingView] = useState('gantt');
  const [milestoneForm, setMilestoneForm] = useState({
    name: '',
    targetDate: '',
    description: ''
  });
  const [activityForm, setActivityForm] = useState({
    name: '',
    category: '',
    description: '',
    startDate: '',
    duration: '',
    priority: '',
    assignedTeam: '',
    resources: '',
    isMilestone: false
  });

  // Materials state
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    costPerUnit: '',
    supplier: '',
    purchaseDate: ''
  });

  // Vehicles state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    type: '',
    registrationNumber: '',
    operator: '',
    rentalCostPerDay: '',
    fuelCostPerDay: '',
    startDate: '',
    endDate: '',
    vendor: ''
  });

  // Expenses state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: '',
    description: '',
    amount: '',
    date: '',
    vendor: '',
    receiptNumber: ''
  });

  // Labour state
  const [isLabourModalOpen, setIsLabourModalOpen] = useState(false);
  const [labourForm, setLabourForm] = useState({
    name: '',
    age: '',
    contact: '',
    dailyWage: '',
    hourlyRate: '',
    skillCategory: '',
    joinDate: ''
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadForm(prev => ({ ...prev, file }));
  };

  const handleSiteFormChange = (field: string, value: string) => {
    setSiteForm(prev => ({ ...prev, [field]: value }));
  };

  // Enhanced form change handlers with interconnections
  const handleActivityFormChange = (field: string, value: string) => {
    setActivityForm(prev => ({ ...prev, [field]: value }));
    
    // Provide real-time suggestions when category changes
    if (field === 'category' && value) {
      const suggestedMaterials = getSuggestedMaterials(value);
      const suggestedVehicles = getSuggestedVehicles(value);
      const suggestedSkills = getSuggestedSkills(value);
      
      console.log(`Real-time suggestions for "${value}":`);
      console.log('Materials:', suggestedMaterials);
      console.log('Vehicles:', suggestedVehicles);
      console.log('Skills:', suggestedSkills);
    }
    
    // Timeline synchronization
    if (field === 'startDate') {
      validateDateWithinSitePeriod(value, 'Activity Start Date');
      syncLabourJoinDateWithActivity(value);
    }
    
    if (field === 'duration' && activityForm.startDate) {
      const duration = parseInt(value) || 0;
      syncActivityDatesWithVehicleRental(activityForm.startDate, duration);
    }
    
    // Auto-sync when both start date and duration are available
    if (field === 'startDate' && activityForm.duration) {
      const duration = parseInt(activityForm.duration) || 0;
      syncActivityDatesWithVehicleRental(value, duration);
    }
  };

  const handleMaterialFormChange = (field: string, value: string) => {
    setMaterialForm(prev => ({ ...prev, [field]: value }));
    
    // Date validation for timeline synchronization
    if (field === 'purchaseDate') {
      validateDateWithinSitePeriod(value, 'Material Purchase Date');
    }
    
    // Auto-calculate total cost when quantity or cost changes
    if ((field === 'quantity' || field === 'costPerUnit')) {
      const currentForm = { ...materialForm, [field]: value };
      if (currentForm.quantity && currentForm.costPerUnit) {
        const totalCost = parseFloat(currentForm.quantity) * parseFloat(currentForm.costPerUnit);
        setMaterialCostCalculation({
          estimatedCost: totalCost,
          isCalculated: true
        });
        console.log(`Estimated material cost: ₹${totalCost}`);
      } else {
        setMaterialCostCalculation({
          estimatedCost: 0,
          isCalculated: false
        });
      }
    }
  };

  const handleVehicleFormChange = (field: string, value: string) => {
    setVehicleForm(prev => ({ ...prev, [field]: value }));
    
    // Date validation for timeline synchronization
    if (field === 'startDate') {
      validateDateWithinSitePeriod(value, 'Vehicle Start Date');
    }
    if (field === 'endDate') {
      validateDateWithinSitePeriod(value, 'Vehicle End Date');
    }
    
    // Auto-calculate total cost when rental/fuel costs or dates change
    if ((field === 'rentalCostPerDay' || field === 'fuelCostPerDay' || 
         field === 'startDate' || field === 'endDate') && 
        vehicleForm.rentalCostPerDay && vehicleForm.fuelCostPerDay && 
        vehicleForm.startDate && vehicleForm.endDate) {
      const totalCost = autoCalculateVehicleCosts();
      console.log(`Estimated vehicle cost: ₹${totalCost}`);
    }
  };

  const handleExpenseFormChange = (field: string, value: string) => {
    setExpenseForm(prev => ({ ...prev, [field]: value }));
    
    // Date validation for timeline synchronization
    if (field === 'date') {
      validateDateWithinSitePeriod(value, 'Expense Date');
    }
    
    // Validate vendor against available vendors
    if (field === 'vendor' && value) {
      const isVendorValid = sharedData.availableVendors.includes(value);
      if (!isVendorValid) {
        console.log(`Vendor "${value}" not found in approved vendors list`);
      }
    }
  };

  const handleLabourFormChange = (field: string, value: string) => {
    setLabourForm(prev => ({ ...prev, [field]: value }));
    
    // Date validation for timeline synchronization
    if (field === 'joinDate') {
      validateDateWithinSitePeriod(value, 'Labour Join Date');
    }
    
    // Auto-calculate monthly wage when daily wage changes
    if (field === 'dailyWage' && value) {
      const dailyWage = parseFloat(value);
      if (dailyWage > 0) {
        const monthlyWage = dailyWage * 26; // Assuming 26 working days
        console.log(`Estimated monthly wage: ₹${monthlyWage}`);
      }
    }
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New site data:', siteForm);
    setIsAddSiteModalOpen(false);
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

  const handleUpload = () => {
    // Handle file upload logic here
    console.log('Uploading:', uploadForm);
    setIsUploadModalOpen(false);
    setUploadForm({ name: '', type: '', file: null });
  };

  const getDocumentTypeLabel = (type: string) => {
    return documentTypes.find(dt => dt.value === type)?.label || type;
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      drawings: 'bg-blue-100 text-blue-800',
      plans: 'bg-green-100 text-green-800',
      permits: 'bg-yellow-100 text-yellow-800',
      contracts: 'bg-purple-100 text-purple-800',
      reports: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  // Scheduling helper functions
  const handleMilestoneSubmit = () => {
    console.log('Adding milestone:', milestoneForm);
    setIsMilestoneModalOpen(false);
    setMilestoneForm({ name: '', targetDate: '', description: '' });
  };

  const handleActivitySubmit = () => {
    console.log('Adding activity:', activityForm);
    
    // Provide suggestions for related resources based on activity category
    if (activityForm.category) {
      const suggestedMaterials = getSuggestedMaterials(activityForm.category);
      const suggestedVehicles = getSuggestedVehicles(activityForm.category);
      const suggestedSkills = getSuggestedSkills(activityForm.category);
      
      console.log(`Activity "${activityForm.name}" suggestions:`);
      console.log('Suggested Materials:', suggestedMaterials);
      console.log('Suggested Vehicles:', suggestedVehicles);
      console.log('Suggested Skills:', suggestedSkills);
      
      // You can use these suggestions to auto-populate related forms
      // or show them as recommendations to the user
    }
    
    setIsActivityModalOpen(false);
    setActivityForm({
      name: '',
      category: '',
      description: '',
      startDate: '',
      duration: '',
      priority: '',
      assignedTeam: '',
      resources: '',
      isMilestone: false
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      completed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'not-started': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors['not-started'];
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  const getProgressBarColor = (progress: number, status: string) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'in-progress') return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Foundation: 'bg-gray-100 text-gray-800',
      Structure: 'bg-blue-100 text-blue-800',
      MEP: 'bg-green-100 text-green-800',
      Finishing: 'bg-purple-100 text-purple-800',
      External: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || colors.Foundation;
  };

  const getCriticalActivities = () => {
    return mockActivities.filter(activity => activity.priority === 'critical');
  };

  // Materials helper functions
  const handleMaterialSubmit = () => {
    console.log('Adding material:', materialForm);
    
    // Auto-create expense entry for material purchase
    const materialCost = parseFloat(materialForm.quantity) * parseFloat(materialForm.costPerUnit);
    if (materialCost > 0) {
      updateTotalExpenses(materialCost);
      console.log(`Auto-created material expense: ₹${materialCost} for ${materialForm.name}`);
    }
    
    setIsMaterialModalOpen(false);
    setMaterialForm({
      name: '',
      category: '',
      quantity: '',
      unit: '',
      costPerUnit: '',
      supplier: '',
      purchaseDate: ''
    });
    
    // Reset material cost calculation
    setMaterialCostCalculation({
      estimatedCost: 0,
      isCalculated: false
    });
  };

  // Vehicles helper functions
  const handleVehicleSubmit = () => {
    console.log('Adding vehicle:', vehicleForm);
    
    // Auto-calculate and create expense entries for vehicle costs
    const totalVehicleCost = autoCalculateVehicleCosts();
    if (totalVehicleCost > 0) {
      updateTotalExpenses(totalVehicleCost);
      console.log(`Auto-created vehicle expense: ₹${totalVehicleCost} for ${vehicleForm.name}`);
    }
    
    setIsVehicleModalOpen(false);
    setVehicleForm({
      name: '',
      type: '',
      registrationNumber: '',
      operator: '',
      rentalCostPerDay: '',
      fuelCostPerDay: '',
      startDate: '',
      endDate: '',
      vendor: ''
    });
  };

  const calculateVehicleTotalCost = () => {
    const rental = parseFloat(vehicleForm.rentalCostPerDay) || 0;
    const fuel = parseFloat(vehicleForm.fuelCostPerDay) || 0;
    const startDate = new Date(vehicleForm.startDate);
    const endDate = new Date(vehicleForm.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 0;
    return (rental + fuel) * days;
  };

  const getVehicleTypeLabel = (type: string) => {
    return vehicleTypes.find(vt => vt.value === type)?.label || type;
  };

  // Expenses helper functions
  const handleExpenseSubmit = () => {
    console.log('Recording expense:', expenseForm);
    
    // Update total site expenses
    const expenseAmount = parseFloat(expenseForm.amount);
    if (expenseAmount > 0) {
      updateTotalExpenses(expenseAmount);
    }
    
    setIsExpenseModalOpen(false);
    setExpenseForm({
      category: '',
      description: '',
      amount: '',
      date: '',
      vendor: '',
      receiptNumber: ''
    });
  };

  // Labour helper functions
  const handleLabourSubmit = () => {
    console.log('Adding labour:', labourForm);
    
    // Auto-create wage expense entry for labour
    const dailyWage = parseFloat(labourForm.dailyWage);
    if (dailyWage > 0) {
      // Estimate monthly wage expense (assuming 26 working days)
      const monthlyWage = dailyWage * 26;
      updateTotalExpenses(monthlyWage);
      console.log(`Auto-created labour expense: ₹${monthlyWage}/month for ${labourForm.name}`);
    }
    
    setIsLabourModalOpen(false);
    setLabourForm({
      name: '',
      age: '',
      contact: '',
      dailyWage: '',
      hourlyRate: '',
      skillCategory: '',
      joinDate: ''
    });
  };

  const getExpenseCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Labour: 'bg-gray-100 text-gray-800',
      Materials: 'bg-blue-100 text-blue-800',
      Equipment: 'bg-green-100 text-green-800',
      Transport: 'bg-yellow-100 text-yellow-800',
      Utilities: 'bg-purple-100 text-purple-800',
      Other: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || colors.Other;
  };

  // Show loading state
  if (sitesLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sites...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (sitesError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading sites: {sitesError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show message if no sites
  if (!sitesData || sitesData.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No sites found. Create your first site to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Site-Focused Management</h2>
              <p className="text-gray-600 mt-1">
                Comprehensive site management with integrated scheduling, materials, vehicles, expenses, and labour.
              </p>
            </div>
            <Button 
              className="flex items-center space-x-2"
              onClick={() => setIsAddSiteModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add New Site</span>
            </Button>
          </div>
        </div>

        {/* Site Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Active Site</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sitesData.map((site) => (
              <div
                key={site.id}
                onClick={() => {
                  setSelectedSite(site);
                  setContextSelectedSite(site);
                }}
                className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
                  selectedSite?.id === site.id 
                    ? 'border-blue-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{site.name}</h4>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <p className="text-sm text-gray-600">{site.location}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        site.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {site.status}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{site.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${site.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="ghost"
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-gray-400 text-gray-900 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {!selectedSite && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Site Selected</h3>
            <p className="text-gray-600">Please select a site from the list above to view details and manage resources.</p>
          </div>
        )}
        
        {activeTab === 'overview' && selectedSite && (
          <div className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budget</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedSite.budget)}</p>
                    <p className="text-xs text-gray-500">Total allocated</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Spent</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedSite.spent)}</p>
                    <p className="text-xs text-orange-600">64.0% used</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>

              {/* Interconnected Expense Tracking */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Tracked Expenses</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(sharedData.totalSiteExpenses)}</p>
                    <p className="text-xs text-blue-600">Auto-calculated from forms</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              {/* Vehicle Expenses from Vehicle Management */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Vehicle Expenses</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(getSiteVehicleExpenses(selectedSite.id))}</p>
                    <p className="text-xs text-green-600">From Vehicle Management</p>
                  </div>
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedSite.progress}%</p>
                  </div>
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${selectedSite.progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Timeline</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(selectedSite.startDate)} to {formatDate(selectedSite.endDate)}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Site Information */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Project Manager</p>
                      <p className="text-sm text-gray-600">{selectedSite.manager}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{selectedSite.location}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedSite.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedSite.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Description</p>
                    <p className="text-sm text-gray-600">Premium residential complex with 200 units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab Content */}
        {activeTab === 'documents' && selectedSite && (
          <div className="space-y-6">
            {/* Documents Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Site Documents</h3>
              <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Site Document</DialogTitle>
                    <DialogDescription>
                      Upload drawings, plans, permits, and other documents
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="document-name">Document Name</Label>
                      <Input
                        id="document-name"
                        placeholder="Site Plan Drawing"
                        value={uploadForm.name}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="document-type">Document Type</Label>
                      <Select value={uploadForm.type} onValueChange={(value) => setUploadForm(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.dwg,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <p className="text-xs text-gray-500">
                        Supported formats: PDF, DWG, JPG, PNG, DOC, DOCX (Max 10MB)
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!uploadForm.name || !uploadForm.type || !uploadForm.file}>
                      Upload Document
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentTypeColor(doc.type)}`}>
                            {getDocumentTypeLabel(doc.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(doc.uploadDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.uploadedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Scheduling Tab Content */}
        {activeTab === 'scheduling' && selectedSite && (
          <div className="space-y-6">
            {/* Scheduling Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Scheduling & Planning</h3>
                <p className="text-sm text-gray-600">Gantt charts, timeline management, and critical path analysis</p>
              </div>
              <div className="flex items-center space-x-3">
                <Dialog open={isMilestoneModalOpen} onOpenChange={setIsMilestoneModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      Add Milestone
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Project Milestone</DialogTitle>
                      <DialogDescription>
                        Create a key milestone for the project
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="milestone-name">Milestone Name</Label>
                        <Input
                          id="milestone-name"
                          placeholder="Foundation Complete"
                          value={milestoneForm.name}
                          onChange={(e) => setMilestoneForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="target-date">Target Date</Label>
                        <DatePicker
                          value={milestoneForm.targetDate ? new Date(milestoneForm.targetDate) : undefined}
                          onChange={(date) => setMilestoneForm(prev => ({ ...prev, targetDate: date?.toISOString().split('T')[0] || '' }))}
                          placeholder="Select target date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="milestone-description">Description</Label>
                        <Textarea
                          id="milestone-description"
                          placeholder="Milestone description..."
                          value={milestoneForm.description}
                          onChange={(e) => setMilestoneForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsMilestoneModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleMilestoneSubmit} disabled={!milestoneForm.name || !milestoneForm.targetDate}>
                        Add Milestone
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Project Activity</DialogTitle>
                      <DialogDescription>
                        Create a new activity in the project schedule
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="activity-name">Activity Name</Label>
                          <Input
                            id="activity-name"
                            placeholder="Foundation Excavation"
                            value={activityForm.name}
                            onChange={(e) => handleActivityFormChange('name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="activity-description">Description</Label>
                          <Textarea
                            id="activity-description"
                            placeholder="Detailed activity description..."
                            value={activityForm.description}
                            onChange={(e) => handleActivityFormChange('description', e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <DatePicker
                            value={activityForm.startDate ? new Date(activityForm.startDate) : undefined}
                            onChange={(date) => handleActivityFormChange('startDate', date?.toISOString().split('T')[0] || '')}
                            placeholder="Select start date"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration (Days)</Label>
                          <Input
                            id="duration"
                            type="number"
                            placeholder="10"
                            value={activityForm.duration}
                            onChange={(e) => handleActivityFormChange('duration', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assigned-team">Assigned Team</Label>
                          <Input
                            id="assigned-team"
                            placeholder="Foundation Team"
                            value={activityForm.assignedTeam}
                            onChange={(e) => handleActivityFormChange('assignedTeam', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is-milestone"
                            checked={activityForm.isMilestone}
                            onCheckedChange={(checked) => setActivityForm(prev => ({ ...prev, isMilestone: checked as boolean }))}
                          />
                          <Label htmlFor="is-milestone">Mark as milestone activity</Label>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select value={activityForm.category} onValueChange={(value) => handleActivityFormChange('category', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {activityCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select value={activityForm.priority} onValueChange={(value) => setActivityForm(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorityLevels.map((priority) => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="resources">Resources (comma-separated)</Label>
                          <Input
                            id="resources"
                            placeholder="Excavator, Dumper, Labor Team"
                            value={activityForm.resources}
                            onChange={(e) => handleActivityFormChange('resources', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsActivityModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleActivitySubmit} disabled={!activityForm.name || !activityForm.category || !activityForm.priority}>
                        Add Activity
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Scheduling Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Activities</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                    <p className="text-xs text-gray-500">2 completed</p>
                  </div>
                  <BarChart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progress</p>
                    <p className="text-2xl font-bold text-gray-900">40%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Path</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-xs text-gray-500">activities</p>
                  </div>
                  <Zap className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Milestones</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                    <p className="text-xs text-gray-500">planned</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Scheduling View Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {schedulingViews.map((view) => (
                  <Button
                    key={view.id}
                    onClick={() => setSchedulingView(view.id)}
                    variant="ghost"
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      schedulingView === view.id
                        ? 'border-gray-400 text-gray-900 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {view.label}
                  </Button>
                ))}
              </nav>
            </div>

            {/* Gantt Chart View */}
            {schedulingView === 'gantt' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Gantt Chart View</h4>
                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{activity.name}</h5>
                          <p className="text-sm text-gray-600">Assigned to {activity.assignedTo}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status.replace('-', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                            {activity.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{activity.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(activity.progress, activity.status)}`}
                              style={{ width: `${activity.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline View */}
            {schedulingView === 'timeline' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Activities Timeline</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockActivities.map((activity) => (
                        <tr key={activity.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {activity.isMilestone && (
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                  <Target className="h-3 w-3 text-white" />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                                <div className="text-sm text-gray-500">{activity.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                              {activity.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
                            </div>
                            <div className="text-sm text-gray-500">{activity.duration} days</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{activity.assignedTo}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(activity.progress, activity.status)}`}
                                  style={{ width: `${activity.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{activity.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status.replace('-', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Critical Path View */}
            {schedulingView === 'critical' && (
              <div className="space-y-6">
                {/* Critical Path Activities */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <Zap className="h-5 w-5 text-orange-600 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-900">Critical Path Activities</h4>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-yellow-800 text-xs font-bold">!</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          These activities are critical to the project timeline. Any delays will impact the overall project completion date.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {getCriticalActivities().map((activity, index) => (
                      <div key={activity.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h5 className="font-medium text-gray-900">{activity.name}</h5>
                                {activity.isMilestone && (
                                  <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <Target className="h-2 w-2 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">{activity.progress}% complete</div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                {activity.status.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Milestones */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Milestones</h4>
                  <div className="space-y-4">
                    {mockMilestones.map((milestone) => (
                      <div key={milestone.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                              <Target className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{milestone.name}</h5>
                              <p className="text-sm text-gray-600">{milestone.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-900">{formatDate(milestone.targetDate)}</div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {milestone.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Materials Tab Content */}
        {activeTab === 'materials' && selectedSite && (
          <div className="space-y-6">
            {/* Loading State */}
            {materialsLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading materials...</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {materialsError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Error loading materials: {materialsError}</p>
                </div>
              </div>
            )}
            
            {/* Materials Content */}
            {!materialsLoading && !materialsError && (
              <div className="space-y-6">
            {/* Materials Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Site Materials</h3>
              <Dialog open={isMaterialModalOpen} onOpenChange={setIsMaterialModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Site Material</DialogTitle>
                    <DialogDescription>
                      Record new material procurement for this site
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="material-name">Material Name</Label>
                        <Input
                          id="material-name"
                          placeholder="Cement (OPC 53)"
                          value={materialForm.name}
                          onChange={(e) => handleMaterialFormChange('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="material-category">Category</Label>
                        <Input
                          id="material-category"
                          placeholder="Cement"
                          value={materialForm.category}
                          onChange={(e) => handleMaterialFormChange('category', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={materialForm.quantity}
                          onChange={(e) => handleMaterialFormChange('quantity', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          placeholder="bags"
                          value={materialForm.unit}
                          onChange={(e) => handleMaterialFormChange('unit', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost-per-unit">Cost per Unit (₹)</Label>
                      <Input
                        id="cost-per-unit"
                        type="number"
                        value={materialForm.costPerUnit}
                        onChange={(e) => handleMaterialFormChange('costPerUnit', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        placeholder="UltraTech"
                        value={materialForm.supplier}
                        onChange={(e) => handleMaterialFormChange('supplier', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchase-date">Purchase Date</Label>
                      <DatePicker
                        value={materialForm.purchaseDate ? new Date(materialForm.purchaseDate) : undefined}
                        onChange={(date) => handleMaterialFormChange('purchaseDate', date?.toISOString().split('T')[0] || '')}
                        placeholder="Select purchase date"
                      />
                    </div>

                    {/* Material Cost Calculation Display */}
                    {materialCostCalculation.isCalculated && materialCostCalculation.estimatedCost > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Info className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-900">Estimated Material Cost</span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-900">
                              ₹{materialCostCalculation.estimatedCost.toLocaleString()}
                            </div>
                            <div className="text-xs text-green-700">
                              {materialForm.quantity} {materialForm.unit || 'units'} × ₹{materialForm.costPerUnit}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-green-700">
                          This cost will be automatically added to the site's expenses
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsMaterialModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleMaterialSubmit} disabled={!materialForm.name || !materialForm.category || !materialForm.quantity}>
                      Add Material
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Materials Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {materialsData.map((material) => (
                      <tr key={material.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Box className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{material.name}</div>
                              <div className="text-sm text-gray-500">{material.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{material.quantity} {material.unit || 'units'}</div>
                          <div className="text-sm text-gray-500">₹{material.cost_per_unit}/{material.unit || 'unit'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(material.quantity * material.cost_per_unit).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Not assigned
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Usage: N/A</div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: '0%' }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Stock: {material.quantity}</div>
                          <div className="text-sm text-gray-500">0% used</div>
                          <Button variant="outline" size="sm" className="mt-1">
                            {material.quantity > 0 ? 'Available' : 'Out of Stock'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
            )}
          </div>
        )}

        {/* Vehicles Tab Content */}
        {activeTab === 'vehicles' && selectedSite && (
          <div className="space-y-6">
            {/* Loading State */}
            {vehiclesLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading vehicles...</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {vehiclesError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Error loading vehicles: {vehiclesError}</p>
                </div>
              </div>
            )}
            
            {/* Vehicles Content */}
            {!vehiclesLoading && !vehiclesError && (
              <div className="space-y-6">
            {/* Vehicles Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Vehicles & Equipment</h3>
              <Dialog open={isVehicleModalOpen} onOpenChange={setIsVehicleModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle/Equipment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Vehicle/Equipment</DialogTitle>
                    <DialogDescription>
                      Register new vehicle or equipment for this site
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicle-name">Vehicle/Equipment Name</Label>
                        <Input
                          id="vehicle-name"
                          placeholder="CAT 320D Excavator"
                          value={vehicleForm.name}
                          onChange={(e) => handleVehicleFormChange('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicle-type">Type</Label>
                        <Select value={vehicleForm.type} onValueChange={(value) => handleVehicleFormChange('type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicleTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registration-number">Registration Number</Label>
                        <Input
                          id="registration-number"
                          placeholder="MH-12-AB-1234"
                          value={vehicleForm.registrationNumber}
                          onChange={(e) => handleVehicleFormChange('registrationNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="operator">Operator</Label>
                        <Input
                          id="operator"
                          placeholder="Ravi Kumar"
                          value={vehicleForm.operator}
                          onChange={(e) => handleVehicleFormChange('operator', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rental-cost">Rental Cost per Day (₹)</Label>
                        <Input
                          id="rental-cost"
                          type="number"
                          value={vehicleForm.rentalCostPerDay}
                          onChange={(e) => handleVehicleFormChange('rentalCostPerDay', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fuel-cost">Fuel Cost per Day (₹)</Label>
                        <Input
                          id="fuel-cost"
                          type="number"
                          value={vehicleForm.fuelCostPerDay}
                          onChange={(e) => handleVehicleFormChange('fuelCostPerDay', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <DatePicker
                          value={vehicleForm.startDate ? new Date(vehicleForm.startDate) : undefined}
                          onChange={(date) => handleVehicleFormChange('startDate', date?.toISOString().split('T')[0] || '')}
                          placeholder="Select start date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <DatePicker
                          value={vehicleForm.endDate ? new Date(vehicleForm.endDate) : undefined}
                          onChange={(date) => handleVehicleFormChange('endDate', date?.toISOString().split('T')[0] || '')}
                          placeholder="Select end date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor">Vendor</Label>
                        <Input
                          id="vendor"
                          placeholder="Heavy Equipment Rentals"
                          value={vehicleForm.vendor}
                          onChange={(e) => handleVehicleFormChange('vendor', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="total-cost">Total Estimated Cost</Label>
                        <Input
                          id="total-cost"
                          value={`₹${calculateVehicleTotalCost().toLocaleString()}`}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsVehicleModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleVehicleSubmit} disabled={!vehicleForm.name || !vehicleForm.type || !vehicleForm.operator}>
                      Add Vehicle
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle/Equipment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vehiclesData.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                            <div className="text-sm text-gray-500">
                              <Truck className="h-3 w-3 inline mr-1" />
                              {vehicle.type}
                            </div>
                            <div className="text-sm text-gray-500">ID: {vehicle.registration_number || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Not assigned</div>
                          <div className="text-sm text-gray-500">No operator linked</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Purchase: ₹{vehicle.purchase_price || 0}</div>
                          <div className="text-sm text-gray-900">Fuel Level: {vehicle.fuel_level || 0}%</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Fuel className="h-3 w-3 mr-1" />
                            Location: {vehicle.location || 'Not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">N/A</div>
                          <div className="text-sm text-gray-500">
                            {vehicle.purchase_date ? new Date(vehicle.purchase_date).toLocaleDateString('en-GB') : 'No date'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(vehicle.purchase_price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {vehicle.status}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Wrench className="h-3 w-3 mr-1" />
                              {vehicle.last_service_date ? new Date(vehicle.last_service_date).toLocaleDateString('en-GB') : 'No service date'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Empty State */}
              {vehiclesData.length === 0 && !vehiclesLoading && (
                <div className="text-center py-12">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first vehicle or equipment.</p>
                  <Button onClick={() => setIsVehicleModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle/Equipment
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expenses Tab Content */}
        {(activeTab as string) === 'expenses' && selectedSite && (
          <div className="space-y-6">
            {/* Loading State */}
            {expensesLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading expenses...</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {expensesError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Error loading expenses: {expensesError}</p>
                </div>
              </div>
            )}
            
            {/* Expenses Content */}
            {!expensesLoading && !expensesError && (
              <div className="space-y-6">
            {/* Expenses Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Site Expenses</h3>
              <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Record Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Record Site Expense</DialogTitle>
                    <DialogDescription>
                      Add a new expense for this site
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="expense-category">Category</Label>
                      <Select value={expenseForm.category} onValueChange={(value) => handleExpenseFormChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-amount">Amount (₹)</Label>
                      <Input
                        id="expense-amount"
                        type="number"
                        value={expenseForm.amount}
                        onChange={(e) => handleExpenseFormChange('amount', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-description">Description</Label>
                      <Textarea
                        id="expense-description"
                        placeholder="Mason work - Week 3"
                        value={expenseForm.description}
                        onChange={(e) => handleExpenseFormChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-date">Date</Label>
                      <DatePicker
                        value={expenseForm.date ? new Date(expenseForm.date) : undefined}
                        onChange={(date) => handleExpenseFormChange('date', date?.toISOString().split('T')[0] || '')}
                        placeholder="Select expense date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-vendor">Vendor</Label>
                      <Input
                        id="expense-vendor"
                        placeholder="Local Contractors"
                        value={expenseForm.vendor}
                        onChange={(e) => handleExpenseFormChange('vendor', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receipt-number">Receipt Number</Label>
                      <Input
                        id="receipt-number"
                        placeholder="RCT001"
                        value={expenseForm.receiptNumber}
                        onChange={(e) => handleExpenseFormChange('receiptNumber', e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExpenseModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleExpenseSubmit} disabled={!expenseForm.category || !expenseForm.amount || !expenseForm.description}>
                      Record Expense
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expensesData.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExpenseCategoryColor(expense.category)}`}>
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {expense.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(parseFloat(expense.amount) || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {expense.date || 'No date'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {expense.vendor || 'Not assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {expense.receipt_number || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Empty State */}
              {expensesData.length === 0 && !expensesLoading && (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
                  <p className="text-gray-600 mb-4">Get started by recording your first expense.</p>
                  <Button onClick={() => setIsExpenseModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Record Expense
                  </Button>
                </div>
              )}
            </div>
          </div>
            )}
          </div>
        )}

        {/* Labour Tab Content */}
        {(activeTab as string) === 'labour' && selectedSite && (
          <div className="space-y-6">
            {/* Labour Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Site Labour</h3>
              <Dialog open={isLabourModalOpen} onOpenChange={setIsLabourModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Labour
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Site Labour</DialogTitle>
                    <DialogDescription>
                      Register new labour for this site
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="labour-name">Name</Label>
                      <Input
                        id="labour-name"
                        placeholder="Ramesh Patil"
                        value={labourForm.name}
                        onChange={(e) => handleLabourFormChange('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="labour-age">Age</Label>
                      <Input
                        id="labour-age"
                        type="number"
                        value={labourForm.age}
                        onChange={(e) => handleLabourFormChange('age', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="labour-contact">Contact Number</Label>
                      <Input
                        id="labour-contact"
                        placeholder="+91 98765 43210"
                        value={labourForm.contact}
                        onChange={(e) => handleLabourFormChange('contact', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="daily-wage">Daily Wage (₹)</Label>
                      <Input
                        id="daily-wage"
                        type="number"
                        value={labourForm.dailyWage}
                        onChange={(e) => handleLabourFormChange('dailyWage', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hourly-rate">Hourly Rate (₹)</Label>
                      <Input
                        id="hourly-rate"
                        type="number"
                        value={labourForm.hourlyRate}
                        onChange={(e) => handleLabourFormChange('hourlyRate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skill-category">Skill Category</Label>
                      <Select value={labourForm.skillCategory} onValueChange={(value) => handleLabourFormChange('skillCategory', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill category" />
                        </SelectTrigger>
                        <SelectContent>
                          {skillCategories.map((skill) => (
                            <SelectItem key={skill.value} value={skill.value}>
                              {skill.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="join-date">Join Date</Label>
                      <DatePicker
                        value={labourForm.joinDate ? new Date(labourForm.joinDate) : undefined}
                        onChange={(date) => handleLabourFormChange('joinDate', date?.toISOString().split('T')[0] || '')}
                        placeholder="Select join date"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLabourModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleLabourSubmit} disabled={!labourForm.name || !labourForm.contact || !labourForm.skillCategory}>
                      Add Labour
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Labour Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Worker Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Work Done
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wages Owed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {labourData.map((worker) => (
                      <tr key={worker.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                            <div className="text-sm text-gray-500">{worker.skill}</div>
                            <div className="text-sm text-gray-500">Experience: {worker.experience_years} years</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{worker.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Daily: ₹{worker.wage_per_day}</div>
                          <div className="text-sm text-gray-900">Hourly: ₹{worker.wage_per_hour}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">N/A days</div>
                          <div className="text-sm text-gray-900">N/A hours</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          N/A
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button variant="outline" size="sm" className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700">
                            {worker.status}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Empty State */}
              {labourData.length === 0 && !labourLoading && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No labour records found</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first worker.</p>
                  <Button onClick={() => setIsLabourModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Worker
                  </Button>
                </div>
              )}
            </div>
          </div>
            )}
          </div>
        )}

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && selectedSite && (
          <div className="space-y-6">
            {/* Overview Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Materials Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Materials</p>
                    <p className="text-2xl font-bold text-gray-900">₹6.8L</p>
                    <p className="text-sm text-gray-500">Total investment</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Box className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Vehicles Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vehicles</p>
                    <p className="text-2xl font-bold text-gray-900">₹36.8L</p>
                    <p className="text-sm text-gray-500">Equipment cost</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Labour Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Labour</p>
                    <p className="text-2xl font-bold text-gray-900">₹0.6L</p>
                    <p className="text-sm text-gray-500">Wages owed</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Total Expenses Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">₹2.1L</p>
                    <p className="text-sm text-gray-500">All categories</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense Distribution Pie Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h3>
                <div className="flex items-center justify-center mb-6">
                  {/* Simple Pie Chart Representation */}
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{
                      background: `conic-gradient(from 0deg, #3b82f6 0deg 216deg, #10b981 216deg 360deg)`
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
                  {expenseDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown Bar Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="space-y-4">
                  {costBreakdown.map((item, index) => {
                    const percentage = (item.amount / item.maxAmount) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{item.category}</span>
                          <span className="text-sm font-bold text-gray-900">₹{(item.amount / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Y-axis labels */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                  <div className="flex justify-between">
                    <span>0</span>
                    <span>950K</span>
                    <span>1.9M</span>
                    <span>2.85M</span>
                    <span>3.8M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tab Content Placeholders */}
        {activeTab !== 'overview' && activeTab !== 'documents' && activeTab !== 'scheduling' && activeTab !== 'materials' && activeTab !== 'vehicles' && activeTab !== 'expenses' && activeTab !== 'labour' && activeTab !== 'analytics' && (
          <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {(() => {
                const TabIcon = tabs.find(tab => tab.id === activeTab)?.icon || BarChart3;
                return <TabIcon className="h-8 w-8 text-gray-400" />;
              })()}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label} Section
            </h3>
            <p className="text-gray-600">
              This section is under development. Content will be added soon.
            </p>
          </div>
        )}

        {/* Add New Construction Site Modal */}
        <Dialog open={isAddSiteModalOpen} onOpenChange={setIsAddSiteModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Construction Site</DialogTitle>
              <DialogDescription>Create a new construction project site</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSite} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input
                      id="site-name"
                      type="text"
                      value={siteForm.siteName}
                      onChange={(e) => handleSiteFormChange('siteName', e.target.value)}
                      placeholder="Enter site name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <DatePicker
                      value={siteForm.startDate ? new Date(siteForm.startDate) : undefined}
                      onChange={(date) => handleSiteFormChange('startDate', date?.toISOString().split('T')[0] || '')}
                      placeholder="Select start date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total-budget">Total Budget (₹)</Label>
                    <Input
                      id="total-budget"
                      type="number"
                      value={siteForm.totalBudget}
                      onChange={(e) => handleSiteFormChange('totalBudget', e.target.value)}
                      placeholder="Enter total budget"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={siteForm.description}
                      onChange={(e) => handleSiteFormChange('description', e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      value={siteForm.location}
                      onChange={(e) => handleSiteFormChange('location', e.target.value)}
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expected-end-date">Expected End Date</Label>
                    <DatePicker
                      value={siteForm.expectedEndDate ? new Date(siteForm.expectedEndDate) : undefined}
                      onChange={(date) => handleSiteFormChange('expectedEndDate', date?.toISOString().split('T')[0] || '')}
                      placeholder="Select expected end date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-manager">Project Manager</Label>
                    <Input
                      id="project-manager"
                      type="text"
                      value={siteForm.projectManager}
                      onChange={(e) => handleSiteFormChange('projectManager', e.target.value)}
                      placeholder="Enter project manager name"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddSiteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Site
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  );
}
