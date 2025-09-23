'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Site, Vehicle } from '@/types';

interface SiteVehicleContextType {
  // Shared state
  selectedSite: Site | null;
  totalVehicleExpenses: number;
  vehicleExpensesBySite: { [siteId: string]: number };
  
  // Shared data
  availableSites: Site[];
  availableVehicles: Vehicle[];
  
  // Actions
  setSelectedSite: (site: Site | null) => void;
  addVehicleExpense: (siteId: string, amount: number) => void;
  updateVehicleExpenses: (siteId: string, amount: number) => void;
  getSiteVehicleExpenses: (siteId: string) => number;
  getTotalVehicleExpenses: () => number;
  
  // Vehicle-Site interconnections
  validateSiteAssignment: (vehicleType: string, siteId: string) => boolean;
  getSuggestedVehicleTypes: (siteId: string) => string[];
  calculateVehicleTotalCost: (perDayCost: number, perHourCost: number, startDate: Date, endDate: Date, dieselCost: number) => number;
}

const SiteVehicleContext = createContext<SiteVehicleContextType | undefined>(undefined);

// Mock data - in real app, this would come from API
const mockSites: Site[] = [
  {
    id: '1',
    name: 'Residential Complex A',
    location: 'Sector 15, Navi Mumbai',
    status: 'active',
    progress: 64,
    budget: 50000000,
    spent: 32000000,
    client: 'ABC Developers',
    manager: 'Rajesh Kumar',
    startDate: '2024-01-15',
    endDate: '2024-12-15'
  },
  {
    id: '2',
    name: 'Commercial Plaza B',
    location: 'Business District, Pune',
    status: 'active',
    progress: 55,
    budget: 75000000,
    spent: 41250000,
    client: 'XYZ Corp',
    manager: 'Priya Sharma',
    startDate: '2024-02-01',
    endDate: '2024-11-30'
  },
  {
    id: '3',
    name: 'Highway Bridge Project',
    location: 'Mumbai-Pune Highway',
    status: 'active',
    progress: 96,
    budget: 120000000,
    spent: 115200000,
    client: 'Government of Maharashtra',
    manager: 'Amit Patel',
    startDate: '2023-06-01',
    endDate: '2024-03-31'
  }
];

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'CAT 320D Excavator',
    type: 'excavator',
    status: 'active',
    location: 'Sector 15, Navi Mumbai',
    fuelLevel: 85,
    lastService: '2024-01-15',
    nextService: '2024-02-15',
    operator: 'Ravi Kumar',
    siteId: '1'
  },
  {
    id: '2',
    name: 'Ashok Leyland Truck',
    type: 'truck',
    status: 'active',
    location: 'Business District, Pune',
    fuelLevel: 70,
    lastService: '2024-01-20',
    nextService: '2024-02-20',
    operator: 'Sunil Patil',
    siteId: '2'
  }
];

export function SiteVehicleProvider({ children }: { children: ReactNode }) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(mockSites[0]);
  const [vehicleExpensesBySite, setVehicleExpensesBySite] = useState<{ [siteId: string]: number }>({
    '1': 5324500,
    '2': 7329000,
    '3': 2246000
  });

  const availableSites = mockSites;
  const availableVehicles = mockVehicles;

  const totalVehicleExpenses = Object.values(vehicleExpensesBySite).reduce((sum, amount) => sum + amount, 0);

  const addVehicleExpense = (siteId: string, amount: number) => {
    setVehicleExpensesBySite(prev => ({
      ...prev,
      [siteId]: (prev[siteId] || 0) + amount
    }));
  };

  const updateVehicleExpenses = (siteId: string, amount: number) => {
    setVehicleExpensesBySite(prev => ({
      ...prev,
      [siteId]: amount
    }));
  };

  const getSiteVehicleExpenses = (siteId: string) => {
    return vehicleExpensesBySite[siteId] || 0;
  };

  const getTotalVehicleExpenses = () => {
    return totalVehicleExpenses;
  };

  // Vehicle-Site interconnection logic
  const validateSiteAssignment = (vehicleType: string, siteId: string) => {
    const site = availableSites.find(s => s.id === siteId);
    if (!site) return false;

    // Define vehicle-site compatibility rules
    const compatibilityRules: { [key: string]: string[] } = {
      'excavator': ['1', '2', '3'], // Excavators can be used on all sites
      'crane': ['1', '2'], // Cranes only on complex and plaza
      'truck': ['1', '2', '3'], // Trucks on all sites
      'concrete-mixer': ['1', '2'], // Mixers on building sites
      'bulldozer': ['3'], // Bulldozers mainly for bridge project
      'generator': ['1', '2', '3'] // Generators on all sites
    };

    return compatibilityRules[vehicleType]?.includes(siteId) || false;
  };

  const getSuggestedVehicleTypes = (siteId: string) => {
    const suggestions: { [key: string]: string[] } = {
      '1': ['excavator', 'crane', 'concrete-mixer', 'truck', 'generator'], // Residential complex
      '2': ['excavator', 'crane', 'concrete-mixer', 'truck', 'generator'], // Commercial plaza
      '3': ['excavator', 'truck', 'bulldozer', 'generator'] // Bridge project
    };

    return suggestions[siteId] || [];
  };

  const calculateVehicleTotalCost = (
    perDayCost: number, 
    perHourCost: number, 
    startDate: Date, 
    endDate: Date, 
    dieselCost: number
  ) => {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const estimatedHours = days * 8; // Assuming 8 hours per day
    const estimatedFuelLiters = days * 50; // Assuming 50L per day average

    const rentalCost = (perDayCost * days) + (perHourCost * estimatedHours);
    const fuelCost = estimatedFuelLiters * dieselCost;

    return rentalCost + fuelCost;
  };

  const value: SiteVehicleContextType = {
    selectedSite,
    totalVehicleExpenses,
    vehicleExpensesBySite,
    availableSites,
    availableVehicles,
    setSelectedSite,
    addVehicleExpense,
    updateVehicleExpenses,
    getSiteVehicleExpenses,
    getTotalVehicleExpenses,
    validateSiteAssignment,
    getSuggestedVehicleTypes,
    calculateVehicleTotalCost
  };

  return (
    <SiteVehicleContext.Provider value={value}>
      {children}
    </SiteVehicleContext.Provider>
  );
}

export function useSiteVehicle() {
  const context = useContext(SiteVehicleContext);
  if (context === undefined) {
    throw new Error('useSiteVehicle must be used within a SiteVehicleProvider');
  }
  return context;
}
