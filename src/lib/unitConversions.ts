// Unit conversion rates and utilities
// Base unit: INR for currency, meters for distance, kg for weight, m³ for volume, m² for area

export interface ConversionRates {
  currency: Record<string, number>;
  distance: Record<string, number>;
  weight: Record<string, number>;
  volume: Record<string, number>;
  area: Record<string, number>;
}

// Conversion rates (to base units)
export const CONVERSION_RATES: ConversionRates = {
  currency: {
    // Base: INR = 1
    INR: 1,
    USD: 0.012, // 1 INR = 0.012 USD (approximate)
    EUR: 0.011, // 1 INR = 0.011 EUR
    GBP: 0.0095, // 1 INR = 0.0095 GBP
    JPY: 1.8, // 1 INR = 1.8 JPY
    CAD: 0.016, // 1 INR = 0.016 CAD
    AUD: 0.018, // 1 INR = 0.018 AUD
  },
  distance: {
    // Base: meters = 1
    meters: 1,
    feet: 3.28084, // 1 meter = 3.28084 feet
    kilometers: 0.001, // 1 meter = 0.001 km
    miles: 0.000621371, // 1 meter = 0.000621371 miles
  },
  weight: {
    // Base: kilograms = 1
    kilograms: 1,
    pounds: 2.20462, // 1 kg = 2.20462 lbs
    tons: 0.001, // 1 kg = 0.001 tons
    'metric tons': 0.001, // 1 kg = 0.001 metric tons
  },
  volume: {
    // Base: cubic meters = 1
    'cubic meters': 1,
    'cubic feet': 35.3147, // 1 m³ = 35.3147 ft³
    liters: 1000, // 1 m³ = 1000 L
    gallons: 264.172, // 1 m³ = 264.172 gallons
  },
  area: {
    // Base: square meters = 1
    'square meters': 1,
    'square feet': 10.7639, // 1 m² = 10.7639 ft²
    acres: 0.000247105, // 1 m² = 0.000247105 acres
    hectares: 0.0001, // 1 m² = 0.0001 hectares
  },
};

// Conversion functions
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to base currency (INR) first
  const baseAmount = amount / CONVERSION_RATES.currency[fromCurrency];
  // Convert from base to target currency
  return baseAmount * CONVERSION_RATES.currency[toCurrency];
}

export function convertDistance(distance: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return distance;
  
  // Convert to base unit (meters) first
  const baseDistance = distance / CONVERSION_RATES.distance[fromUnit];
  // Convert from base to target unit
  return baseDistance * CONVERSION_RATES.distance[toUnit];
}

export function convertWeight(weight: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return weight;
  
  // Convert to base unit (kilograms) first
  const baseWeight = weight / CONVERSION_RATES.weight[fromUnit];
  // Convert from base to target unit
  return baseWeight * CONVERSION_RATES.weight[toUnit];
}

export function convertVolume(volume: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return volume;
  
  // Convert to base unit (cubic meters) first
  const baseVolume = volume / CONVERSION_RATES.volume[fromUnit];
  // Convert from base to target unit
  return baseVolume * CONVERSION_RATES.volume[toUnit];
}

export function convertArea(area: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return area;
  
  // Convert to base unit (square meters) first
  const baseArea = area / CONVERSION_RATES.area[fromUnit];
  // Convert from base to target unit
  return baseArea * CONVERSION_RATES.area[toUnit];
}

// Utility function to get conversion rate between two units
export function getConversionRate(fromUnit: string, toUnit: string, type: keyof ConversionRates): number {
  if (fromUnit === toUnit) return 1;
  
  const rates = CONVERSION_RATES[type];
  if (!rates[fromUnit] || !rates[toUnit]) return 1;
  
  // Convert to base unit first, then to target unit
  return rates[toUnit] / rates[fromUnit];
}

// Format converted values with appropriate precision
export function formatConvertedValue(value: number, type: string): string {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    case 'distance':
    case 'weight':
    case 'volume':
    case 'area':
      return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    default:
      return value.toString();
  }
}
