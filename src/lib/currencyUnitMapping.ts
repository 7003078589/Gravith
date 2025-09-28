// Currency to unit system mapping
// When a currency is selected, all units automatically change to match that region's standard

export interface CurrencyUnitMapping {
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
}

// Currency-based unit systems
export const CURRENCY_UNIT_MAPPINGS: Record<string, CurrencyUnitMapping> = {
  // US Dollar - US Customary Units
  USD: {
    currency: { symbol: '$', code: 'USD', name: 'US Dollar', position: 'before' },
    distance: { unit: 'feet', symbol: 'ft' },
    weight: { unit: 'pounds', symbol: 'lbs' },
    volume: { unit: 'gallons', symbol: 'gal' },
    area: { unit: 'square feet', symbol: 'ft²' },
  },
  
  // Indian Rupee - Metric Units
  INR: {
    currency: { symbol: '₹', code: 'INR', name: 'Indian Rupee', position: 'before' },
    distance: { unit: 'meters', symbol: 'm' },
    weight: { unit: 'kilograms', symbol: 'kg' },
    volume: { unit: 'cubic meters', symbol: 'm³' },
    area: { unit: 'square meters', symbol: 'm²' },
  },
  
  // Euro - Metric Units
  EUR: {
    currency: { symbol: '€', code: 'EUR', name: 'Euro', position: 'after' },
    distance: { unit: 'meters', symbol: 'm' },
    weight: { unit: 'kilograms', symbol: 'kg' },
    volume: { unit: 'cubic meters', symbol: 'm³' },
    area: { unit: 'square meters', symbol: 'm²' },
  },
  
  // British Pound - Mixed (Metric with some Imperial)
  GBP: {
    currency: { symbol: '£', code: 'GBP', name: 'British Pound', position: 'before' },
    distance: { unit: 'meters', symbol: 'm' },
    weight: { unit: 'kilograms', symbol: 'kg' },
    volume: { unit: 'cubic meters', symbol: 'm³' },
    area: { unit: 'square meters', symbol: 'm²' },
  },
  
  // Japanese Yen - Metric Units
  JPY: {
    currency: { symbol: '¥', code: 'JPY', name: 'Japanese Yen', position: 'before' },
    distance: { unit: 'meters', symbol: 'm' },
    weight: { unit: 'kilograms', symbol: 'kg' },
    volume: { unit: 'cubic meters', symbol: 'm³' },
    area: { unit: 'square meters', symbol: 'm²' },
  },
  
  // Canadian Dollar - Metric Units (Canada uses metric)
  CAD: {
    currency: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', position: 'before' },
    distance: { unit: 'meters', symbol: 'm' },
    weight: { unit: 'kilograms', symbol: 'kg' },
    volume: { unit: 'cubic meters', symbol: 'm³' },
    area: { unit: 'square meters', symbol: 'm²' },
  },
  
  // Australian Dollar - Metric Units
  AUD: {
    currency: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar', position: 'before' },
    distance: { unit: 'meters', symbol: 'm' },
    weight: { unit: 'kilograms', symbol: 'kg' },
    volume: { unit: 'cubic meters', symbol: 'm³' },
    area: { unit: 'square meters', symbol: 'm²' },
  },
};

// Get unit system for a currency
export function getUnitSystemForCurrency(currencyCode: string): CurrencyUnitMapping {
  return CURRENCY_UNIT_MAPPINGS[currencyCode] || CURRENCY_UNIT_MAPPINGS.INR; // Default to INR if not found
}

// Get all available currencies
export function getAvailableCurrencies() {
  return Object.keys(CURRENCY_UNIT_MAPPINGS).map(code => {
    const currency = CURRENCY_UNIT_MAPPINGS[code].currency;
    return {
      code,
      symbol: currency.symbol,
      name: currency.name,
      position: currency.position
    };
  });
}
