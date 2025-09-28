'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  DollarSign,
  Fuel,
  Users,
  Package,
  Zap,
  Activity,
  Globe
} from 'lucide-react';
import { useUnits } from '@/contexts/UnitContext';

interface PriceData {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  icon: any;
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
}

const LivePriceTracker = () => {
  const { formatCurrency } = useUnits();
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Icon mapping for different categories
  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'materials':
        return Package;
      case 'fuel':
        return Fuel;
      case 'labor':
        return Users;
      case 'utilities':
        return Zap;
      default:
        return Package;
    }
  };

  // Fetch prices from API
  const fetchPrices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/pricing');
      const result = await response.json();
      
      if (result.success && result.data) {
        const pricesWithIcons = result.data.map((price: any) => ({
          ...price,
          icon: getIconForCategory(price.category),
          lastUpdated: new Date(price.lastUpdated)
        }));
        setPrices(pricesWithIcons);
        setLastUpdate(new Date(result.lastUpdated));
      } else {
        console.error('Failed to fetch pricing data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch prices on component mount and set up interval
  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Update every 30 seconds
    const interval = setInterval(fetchPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string, change: number) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const formatPrice = (price: number, unit: string) => {
    if (unit === 'per bag' || unit === 'per day' || unit === 'per cubic ft') {
      return `₹${price.toFixed(0)}`;
    }
    if (unit === 'per ton') {
      return `₹${(price / 1000).toFixed(1)}K`;
    }
    if (unit === 'per liter' || unit === 'per kWh') {
      return `₹${price.toFixed(1)}`;
    }
    return `₹${price.toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading live prices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Price Tracker</h3>
            <p className="text-sm text-gray-600">Real-time market prices</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPrices}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            title="Refresh prices"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((price) => (
          <div key={price.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <price.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{price.name}</h4>
                  <p className="text-xs text-gray-500">{price.category}</p>
                </div>
              </div>
              {getTrendIcon(price.trend)}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(price.currentPrice, price.unit)}
                </span>
                <div className={`text-sm font-medium ${getTrendColor(price.trend, price.change)}`}>
                  {price.change > 0 ? '+' : ''}{price.changePercent.toFixed(1)}%
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{price.unit}</span>
                <span className={getTrendColor(price.trend, price.change)}>
                  {price.change > 0 ? '+' : ''}{formatPrice(Math.abs(price.change), price.unit)}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    price.trend === 'up' ? 'bg-green-500' : 
                    price.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                  style={{ 
                    width: `${Math.min(Math.abs(price.changePercent) * 10, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Rising</p>
            <p className="text-lg font-bold text-green-600">
              {prices.filter(p => p.trend === 'up').length}
            </p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-sm text-gray-600">Falling</p>
            <p className="text-lg font-bold text-red-600">
              {prices.filter(p => p.trend === 'down').length}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-gray-600" />
            </div>
            <p className="text-sm text-gray-600">Stable</p>
            <p className="text-lg font-bold text-gray-600">
              {prices.filter(p => p.trend === 'stable').length}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Globe className="h-3 w-3" />
            <span>Market data from multiple sources</span>
          </div>
          <span>Updates every 30 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default LivePriceTracker;
