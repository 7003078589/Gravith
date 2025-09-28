'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  convertCurrency, 
  convertDistance, 
  convertWeight, 
  convertVolume, 
  convertArea,
  formatConvertedValue 
} from '@/lib/unitConversions';
import { getUnitSystemForCurrency, getAvailableCurrencies } from '@/lib/currencyUnitMapping';

export interface UnitPreferences {
  currency: {
    symbol: string;
    code: string;
    name: string;
    position: 'before' | 'after';
  };
  distance: {
    unit: string;
    symbol: string;
  };
  weight: {
    unit: string;
    symbol: string;
  };
  volume: {
    unit: string;
    symbol: string;
  };
  area: {
    unit: string;
    symbol: string;
  };
  // Base units for conversion (stored in database)
  baseUnits: {
    currency: string; // 'INR'
    distance: string; // 'meters'
    weight: string; // 'kilograms'
    volume: string; // 'cubic meters'
    area: string; // 'square meters'
  };
}

export const UNIT_OPTIONS = {
  currency: [
    { symbol: '₹', code: 'INR', name: 'Indian Rupee', position: 'before' as const },
    { symbol: '$', code: 'USD', name: 'US Dollar', position: 'before' as const },
    { symbol: '€', code: 'EUR', name: 'Euro', position: 'before' as const },
    { symbol: '£', code: 'GBP', name: 'British Pound', position: 'before' as const },
    { symbol: '¥', code: 'JPY', name: 'Japanese Yen', position: 'before' as const },
    { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', position: 'before' as const },
    { symbol: 'A$', code: 'AUD', name: 'Australian Dollar', position: 'before' as const },
  ],
  distance: [
    { unit: 'meters', symbol: 'm' },
    { unit: 'feet', symbol: 'ft' },
    { unit: 'kilometers', symbol: 'km' },
    { unit: 'miles', symbol: 'mi' },
  ],
  weight: [
    { unit: 'kilograms', symbol: 'kg' },
    { unit: 'pounds', symbol: 'lbs' },
    { unit: 'tons', symbol: 't' },
    { unit: 'metric tons', symbol: 'MT' },
  ],
  volume: [
    { unit: 'cubic meters', symbol: 'm³' },
    { unit: 'cubic feet', symbol: 'ft³' },
    { unit: 'liters', symbol: 'L' },
    { unit: 'gallons', symbol: 'gal' },
  ],
  area: [
    { unit: 'square meters', symbol: 'm²' },
    { unit: 'square feet', symbol: 'ft²' },
    { unit: 'acres', symbol: 'ac' },
    { unit: 'hectares', symbol: 'ha' },
  ],
};

const DEFAULT_UNITS: UnitPreferences = {
  currency: UNIT_OPTIONS.currency[0], // INR
  distance: UNIT_OPTIONS.distance[0], // meters
  weight: UNIT_OPTIONS.weight[0], // kilograms
  volume: UNIT_OPTIONS.volume[0], // cubic meters
  area: UNIT_OPTIONS.area[0], // square meters
  baseUnits: {
    currency: 'INR',
    distance: 'meters',
    weight: 'kilograms',
    volume: 'cubic meters',
    area: 'square meters',
  },
};

interface UnitContextType {
  units: UnitPreferences;
  updateUnits: (newUnits: Partial<UnitPreferences>) => void;
  formatCurrency: (amount: number) => string;
  formatDistance: (distance: number) => string;
  formatWeight: (weight: number) => string;
  formatVolume: (volume: number) => string;
  formatArea: (area: number) => string;
  // Conversion functions (from base units to selected units)
  convertCurrency: (amount: number) => number;
  convertDistance: (distance: number) => number;
  convertWeight: (weight: number) => number;
  convertVolume: (volume: number) => number;
  convertArea: (area: number) => number;
  // Reverse conversion functions (from selected units to base units)
  convertToBaseCurrency: (amount: number) => number;
  convertToBaseDistance: (distance: number) => number;
  convertToBaseWeight: (weight: number) => number;
  convertToBaseVolume: (volume: number) => number;
  convertToBaseArea: (area: number) => number;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [units, setUnits] = useState<UnitPreferences>(DEFAULT_UNITS);

  // Load units from localStorage on mount
  useEffect(() => {
    const savedUnits = localStorage.getItem('unit-preferences');
    if (savedUnits) {
      try {
        const parsed = JSON.parse(savedUnits);
        setUnits({ ...DEFAULT_UNITS, ...parsed });
      } catch (error) {
        console.error('Error loading unit preferences:', error);
      }
    }
  }, []);

  // Save units to localStorage when they change
  useEffect(() => {
    localStorage.setItem('unit-preferences', JSON.stringify(units));
  }, [units]);

  const updateUnits = (newUnits: Partial<UnitPreferences>) => {
    setUnits(prev => {
      const updated = { ...prev, ...newUnits };
      
      // If currency is being changed, automatically update all other units
      if (newUnits.currency) {
        const unitSystem = getUnitSystemForCurrency(newUnits.currency.code);
        return {
          ...updated,
          currency: unitSystem.currency,
          distance: unitSystem.distance,
          weight: unitSystem.weight,
          volume: unitSystem.volume,
          area: unitSystem.area,
        };
      }
      
      return updated;
    });
  };

  // Conversion functions (from base units to selected units)
  const convertCurrencyValue = (amount: number): number => {
    return convertCurrency(amount, units.baseUnits.currency, units.currency.code);
  };

  const convertDistanceValue = (distance: number): number => {
    return convertDistance(distance, units.baseUnits.distance, units.distance.unit);
  };

  const convertWeightValue = (weight: number): number => {
    return convertWeight(weight, units.baseUnits.weight, units.weight.unit);
  };

  const convertVolumeValue = (volume: number): number => {
    return convertVolume(volume, units.baseUnits.volume, units.volume.unit);
  };

  const convertAreaValue = (area: number): number => {
    return convertArea(area, units.baseUnits.area, units.area.unit);
  };

  // Reverse conversion functions (from selected units to base units)
  const convertToBaseCurrencyValue = (amount: number): number => {
    return convertCurrency(amount, units.currency.code, units.baseUnits.currency);
  };

  const convertToBaseDistanceValue = (distance: number): number => {
    return convertDistance(distance, units.distance.unit, units.baseUnits.distance);
  };

  const convertToBaseWeightValue = (weight: number): number => {
    return convertWeight(weight, units.weight.unit, units.baseUnits.weight);
  };

  const convertToBaseVolumeValue = (volume: number): number => {
    return convertVolume(volume, units.volume.unit, units.baseUnits.volume);
  };

  const convertToBaseAreaValue = (area: number): number => {
    return convertArea(area, units.area.unit, units.baseUnits.area);
  };

  // Formatting functions with conversion
  const formatCurrency = (amount: number): string => {
    const { symbol, position } = units.currency;
    const convertedAmount = convertCurrencyValue(amount);
    const formattedAmount = formatConvertedValue(convertedAmount, 'currency');
    
    return position === 'before' 
      ? `${symbol}${formattedAmount}` 
      : `${formattedAmount} ${symbol}`;
  };

  const formatDistance = (distance: number): string => {
    const { symbol } = units.distance;
    const convertedDistance = convertDistanceValue(distance);
    const formattedDistance = formatConvertedValue(convertedDistance, 'distance');
    return `${formattedDistance} ${symbol}`;
  };

  const formatWeight = (weight: number): string => {
    const { symbol } = units.weight;
    const convertedWeight = convertWeightValue(weight);
    const formattedWeight = formatConvertedValue(convertedWeight, 'weight');
    return `${formattedWeight} ${symbol}`;
  };

  const formatVolume = (volume: number): string => {
    const { symbol } = units.volume;
    const convertedVolume = convertVolumeValue(volume);
    const formattedVolume = formatConvertedValue(convertedVolume, 'volume');
    return `${formattedVolume} ${symbol}`;
  };

  const formatArea = (area: number): string => {
    const { symbol } = units.area;
    const convertedArea = convertAreaValue(area);
    const formattedArea = formatConvertedValue(convertedArea, 'area');
    return `${formattedArea} ${symbol}`;
  };

  return (
    <UnitContext.Provider value={{
      units,
      updateUnits,
      formatCurrency,
      formatDistance,
      formatWeight,
      formatVolume,
      formatArea,
      // Conversion functions
      convertCurrency: convertCurrencyValue,
      convertDistance: convertDistanceValue,
      convertWeight: convertWeightValue,
      convertVolume: convertVolumeValue,
      convertArea: convertAreaValue,
      // Reverse conversion functions
      convertToBaseCurrency: convertToBaseCurrencyValue,
      convertToBaseDistance: convertToBaseDistanceValue,
      convertToBaseWeight: convertToBaseWeightValue,
      convertToBaseVolume: convertToBaseVolumeValue,
      convertToBaseArea: convertToBaseAreaValue,
    }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitProvider');
  }
  return context;
}
