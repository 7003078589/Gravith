'use client';

import React from 'react';
import { useUnits } from '@/contexts/UnitContext';

export default function UnitConversionDemo() {
  const { formatCurrency, formatDistance, formatWeight, formatVolume, formatArea, units } = useUnits();

  // Demo values in base units
  const demoValues = {
    currency: 1000, // 1000 INR
    distance: 100, // 100 meters
    weight: 50, // 50 kg
    volume: 10, // 10 cubic meters
    area: 25, // 25 square meters
  };

  // Material examples with different units
  const materialExamples = [
    { name: 'Cement', quantity: 100, unit: 'Kilograms', cost: 425 },
    { name: 'Steel Rods', quantity: 50, unit: 'Tons', cost: 50000 },
    { name: 'Sand', quantity: 5, unit: 'Cubic Meters', cost: 2000 },
    { name: 'Bricks', quantity: 1000, unit: 'Pieces', cost: 5000 },
    { name: 'Paint', quantity: 20, unit: 'Liters', cost: 1500 },
  ];

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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Conversion Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        These values are automatically converted based on your selected units:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Currency:</span>
            <span className="text-sm font-bold text-gray-900">
              {formatCurrency(demoValues.currency)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Distance:</span>
            <span className="text-sm font-bold text-gray-900">
              {formatDistance(demoValues.distance)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Weight:</span>
            <span className="text-sm font-bold text-gray-900">
              {formatWeight(demoValues.weight)}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Volume:</span>
            <span className="text-sm font-bold text-gray-900">
              {formatVolume(demoValues.volume)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Area:</span>
            <span className="text-sm font-bold text-gray-900">
              {formatArea(demoValues.area)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Base Values:</strong> ₹1000, 100m, 50kg, 10m³, 25m²
        </p>
        <p className="text-xs text-blue-700 mt-1">
          <strong>Current Units:</strong> {units.currency.code}, {units.distance.unit}, {units.weight.unit}, {units.volume.unit}, {units.area.unit}
        </p>
      </div>

      {/* Material Examples */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Material Inventory Examples</h4>
        <div className="space-y-2">
          {materialExamples.map((material, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">{material.name}:</span>
                <span className="text-sm text-gray-600 ml-2">
                  {formatMaterialQuantity(material.quantity, material.unit)}
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {formatCurrency(material.cost)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-2 bg-green-50 rounded-lg">
          <p className="text-xs text-green-700">
            <strong>💡 Smart Unit Selection:</strong> Just change the currency in the header!
            <br />
            <strong>USD:</strong> All units automatically switch to US standards (feet, pounds, gallons)
            <br />
            <strong>EUR/INR:</strong> All units automatically switch to metric (meters, kg, m³)
          </p>
        </div>
      </div>
    </div>
  );
}
