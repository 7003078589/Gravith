'use client';

import React, { useState } from 'react';
import { Settings, DollarSign, Ruler, Weight, Package, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnits, UNIT_OPTIONS } from '@/contexts/UnitContext';
import { getAvailableCurrencies } from '@/lib/currencyUnitMapping';

interface UnitSelectorProps {
  className?: string;
}

export default function UnitSelector({ className = '' }: UnitSelectorProps) {
  const { units, updateUnits } = useUnits();
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencyChange = (value: string) => {
    const selectedCurrency = getAvailableCurrencies().find(c => c.code === value);
    if (selectedCurrency) {
      // This will automatically update all units based on currency
      updateUnits({ currency: selectedCurrency });
    }
  };

  const handleDistanceChange = (value: string) => {
    const selectedDistance = UNIT_OPTIONS.distance.find(d => d.unit === value);
    if (selectedDistance) {
      updateUnits({ distance: selectedDistance });
    }
  };

  const handleWeightChange = (value: string) => {
    const selectedWeight = UNIT_OPTIONS.weight.find(w => w.unit === value);
    if (selectedWeight) {
      updateUnits({ weight: selectedWeight });
    }
  };

  const handleVolumeChange = (value: string) => {
    const selectedVolume = UNIT_OPTIONS.volume.find(v => v.unit === value);
    if (selectedVolume) {
      updateUnits({ volume: selectedVolume });
    }
  };

  const handleAreaChange = (value: string) => {
    const selectedArea = UNIT_OPTIONS.area.find(a => a.unit === value);
    if (selectedArea) {
      updateUnits({ area: selectedArea });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Settings className="h-4 w-4" />
        <span>Units</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Unit Preferences</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <label className="text-sm font-medium text-gray-700">Currency</label>
              </div>
              <Select value={units.currency.code} onValueChange={handleCurrencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCurrencies().map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Distance */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Ruler className="h-4 w-4 text-blue-600" />
                <label className="text-sm font-medium text-gray-700">Distance</label>
              </div>
              <Select value={units.distance.unit} onValueChange={handleDistanceChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.distance.map((distance) => (
                    <SelectItem key={distance.unit} value={distance.unit}>
                      {distance.symbol} {distance.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Weight className="h-4 w-4 text-orange-600" />
                <label className="text-sm font-medium text-gray-700">Weight</label>
              </div>
              <Select value={units.weight.unit} onValueChange={handleWeightChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.weight.map((weight) => (
                    <SelectItem key={weight.unit} value={weight.unit}>
                      {weight.symbol} {weight.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-purple-600" />
                <label className="text-sm font-medium text-gray-700">Volume</label>
              </div>
              <Select value={units.volume.unit} onValueChange={handleVolumeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.volume.map((volume) => (
                    <SelectItem key={volume.unit} value={volume.unit}>
                      {volume.symbol} {volume.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Square className="h-4 w-4 text-indigo-600" />
                <label className="text-sm font-medium text-gray-700">Area</label>
              </div>
              <Select value={units.area.unit} onValueChange={handleAreaChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.area.map((area) => (
                    <SelectItem key={area.unit} value={area.unit}>
                      {area.symbol} {area.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Your unit preferences are saved automatically and will apply across the entire application.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                💡 <strong>Smart Unit Selection:</strong> When you change currency, all units automatically change to match that region's standards!
              </p>
              <p className="text-xs text-green-600 mt-1">
                <strong>Examples:</strong> USD → feet, pounds, gallons | EUR/INR → meters, kg, m³
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
