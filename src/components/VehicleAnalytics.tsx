import React, { useState } from 'react';
import { useVehicleAnalytics } from '@/hooks/useVehicleAnalytics';
import { useVehicles } from '@/hooks/useApi';
import { useUnits } from '@/contexts/UnitContext';
import { 
  Search, 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Fuel, 
  MapPin, 
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const VehicleAnalytics: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportType, setReportType] = useState<'fuel-consumption' | 'usage-analysis' | 'mileage-tracking' | 'cost-analysis'>('fuel-consumption');
  
  const { data: vehicles } = useVehicles();
  const { formatCurrency, formatDistance } = useUnits();
  
  const { data: analyticsData, loading, error, refetch } = useVehicleAnalytics({
    vehicleId: selectedVehicle,
    startDate,
    endDate,
    reportType
  });

  const handleExportReport = () => {
    if (!analyticsData) return;
    
    const reportData = {
      vehicle: Array.isArray(vehicles) ? vehicles.find(v => v.id === selectedVehicle) : null,
      dateRange: { startDate, endDate },
      reportType,
      generatedAt: new Date().toISOString(),
      data: analyticsData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicle-analytics-${selectedVehicle}-${reportType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderFuelConsumptionReport = () => {
    if (!analyticsData) return null;

    const { refuelingRecords, usageRecords, summary } = analyticsData;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Refuels</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_refuels}</div>
              <p className="text-xs text-muted-foreground">
                {summary.first_refuel_date && summary.last_refuel_date && 
                  `${new Date(summary.first_refuel_date).toLocaleDateString()} - ${new Date(summary.last_refuel_date).toLocaleDateString()}`
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fuel</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_fuel_consumed?.toFixed(1)} L</div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(summary.avg_cost_per_liter)}/L
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.total_fuel_cost)}</div>
              <p className="text-xs text-muted-foreground">
                {summary.total_refuels > 0 && formatCurrency(summary.total_fuel_cost / summary.total_refuels)} per refuel
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.avg_fuel_efficiency ? summary.avg_fuel_efficiency.toFixed(1) : 'N/A'} km/L
              </div>
              <p className="text-xs text-muted-foreground">
                Total: {formatDistance(summary.total_mileage_covered)} km
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Refueling Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Refueling Analysis</CardTitle>
            <CardDescription>Detailed fuel consumption between refueling points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage Gap</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {refuelingRecords.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.refueling_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDistance(record.mileage)} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fuel_amount} L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(record.fuel_cost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.mileage_between_refuels ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.mileage_between_refuels > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.mileage_between_refuels > 0 ? '+' : ''}{formatDistance(record.mileage_between_refuels)} km
                          </span>
                        ) : (
                          <span className="text-gray-400">First refuel</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fuel_efficiency_km_per_liter ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.fuel_efficiency_km_per_liter > 10 ? 'bg-green-100 text-green-800' :
                            record.fuel_efficiency_km_per_liter > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.fuel_efficiency_km_per_liter.toFixed(1)} km/L
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.station_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Usage Records */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Records</CardTitle>
            <CardDescription>Vehicle usage and route information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usageRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.usage_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{record.start_location}</div>
                          <div className="text-gray-500">→ {record.end_location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDistance(record.distance)} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fuel_consumed} L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fuel_consumed > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {(record.distance / record.fuel_consumed).toFixed(1)} km/L
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.driver_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderUsageAnalysisReport = () => {
    if (!analyticsData) return null;
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Analysis Report</CardTitle>
            <CardDescription>Detailed usage analysis for the selected vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Usage analysis data will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMileageTrackingReport = () => {
    if (!analyticsData) return null;
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mileage Tracking Report</CardTitle>
            <CardDescription>Mileage tracking data for the selected vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Mileage tracking data will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCostAnalysisReport = () => {
    if (!analyticsData) return null;
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis Report</CardTitle>
            <CardDescription>Cost analysis data for the selected vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Cost analysis data will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Analytics & Reports</h2>
          <p className="text-gray-600">Comprehensive fuel consumption and usage analysis</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refetch}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExportReport}
            disabled={!analyticsData}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="vehicle-select">Select Vehicle</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(vehicles) ? vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.type})
                    </SelectItem>
                  )) : null}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fuel-consumption">Fuel Consumption</SelectItem>
                  <SelectItem value="usage-analysis">Usage Analysis</SelectItem>
                  <SelectItem value="mileage-tracking">Mileage Tracking</SelectItem>
                  <SelectItem value="cost-analysis">Cost Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading analytics data...</span>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-red-600 mb-2">Error loading analytics</div>
              <div className="text-sm text-gray-600">{error}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {!loading && !error && !analyticsData && selectedVehicle && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-gray-600 mb-2">No data available</div>
              <div className="text-sm text-gray-500">
                No records found for the selected vehicle and date range
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Content */}
      {!loading && !error && analyticsData && (
        <>
          {reportType === 'fuel-consumption' && renderFuelConsumptionReport()}
          {reportType === 'usage-analysis' && renderUsageAnalysisReport()}
          {reportType === 'mileage-tracking' && renderMileageTrackingReport()}
          {reportType === 'cost-analysis' && renderCostAnalysisReport()}
        </>
      )}

      {/* Instructions */}
      {!selectedVehicle && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">Select a Vehicle</div>
              <div className="text-sm text-gray-600">
                Choose a vehicle from the dropdown above to view detailed analytics and reports
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleAnalytics;
