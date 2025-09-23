'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImportResult {
  success: boolean;
  message: string;
  results?: {
    sites?: any[];
    vehicles?: any[];
    materials?: any[];
    expenses?: any[];
    labour?: any[];
    vendors?: any[];
  };
  errors?: string[];
  summary?: {
    sites: number;
    vehicles: number;
    materials: number;
    expenses: number;
    labour: number;
    vendors: number;
  };
}

export default function ExcelImport() {
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setImportResult({
        success: false,
        message: 'Please upload an Excel file (.xlsx or .xls)'
      });
      return;
    }

    setIsUploading(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import/excel', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setImportResult({
          success: true,
          message: result.message,
          results: result.results,
          errors: result.errors,
          summary: result.summary
        });
      } else {
        setImportResult({
          success: false,
          message: result.error || 'Failed to import Excel file'
        });
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const downloadTemplate = () => {
    // Create a simple template Excel file structure
    const templateData = {
      sites: [
        {
          name: 'Sample Site',
          location: 'Sample Location',
          status: 'active',
          progress: 50,
          budget: 1000000,
          spent: 500000,
          client: 'Sample Client',
          manager: 'Sample Manager',
          start_date: '2024-01-01',
          end_date: '2024-12-31'
        }
      ],
      vehicles: [
        {
          type: 'excavator',
          make: 'Caterpillar',
          model: '320D',
          year: 2020,
          registration_number: 'MH01AB1234',
          capacity: 2000,
          fuel_type: 'diesel',
          per_day_cost: 5000,
          per_hour_cost: 500,
          status: 'available'
        }
      ],
      materials: [
        {
          name: 'Cement',
          category: 'Construction',
          unit: 'bags',
          quantity: 100,
          unit_price: 400,
          total_cost: 40000,
          supplier: 'Sample Supplier',
          purchase_date: '2024-01-15'
        }
      ],
      expenses: [
        {
          description: 'Site preparation',
          amount: 50000,
          category: 'Site Setup',
          date: '2024-01-10'
        }
      ],
      labour: [
        {
          name: 'John Doe',
          skill: 'Mason',
          phone: '9876543210',
          wage_per_day: 800,
          join_date: '2024-01-01',
          status: 'active'
        }
      ],
      vendors: [
        {
          name: 'ABC Construction Supplies',
          contact_person: 'Jane Smith',
          phone: '9876543210',
          email: 'jane@abc.com',
          address: '123 Construction Street',
          specialization: 'Construction Materials',
          rating: 4.5,
          status: 'active'
        }
      ]
    };

    // Create download link
    const dataStr = JSON.stringify(templateData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'excel_import_template.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Excel Data Import</h2>
        <p className="text-gray-600">Upload your Excel files to import real construction data into the system</p>
      </div>

      {/* Upload Area */}
      <Card className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop your Excel file here or click to browse
          </h3>
          <p className="text-gray-600 mb-4">
            Supports .xlsx and .xls files up to 10MB
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mr-4"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Choose File'}
          </Button>
          
          <Button
            variant="outline"
            onClick={downloadTemplate}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          
          <div className="mt-4">
            <a 
              href="/excel-import-guide.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              📖 View Detailed Import Guide
            </a>
          </div>
        </div>
      </Card>

      {/* Excel Format Instructions */}
      <Card className="p-6">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Excel File Format Requirements</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Sheet Names:</strong> Your Excel file should have sheets named exactly as follows:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Sites</strong> - Construction site information</li>
                <li><strong>Vehicles</strong> - Vehicle and equipment data</li>
                <li><strong>Materials</strong> - Material inventory and costs</li>
                <li><strong>Expenses</strong> - Expense records</li>
                <li><strong>Labour</strong> - Worker information</li>
                <li><strong>Vendors</strong> - Supplier/vendor details</li>
              </ul>
              <p><strong>Note:</strong> You don't need all sheets - include only the data you want to import.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Import Results */}
      {importResult && (
        <Card className="p-6">
          <div className="flex items-start space-x-3">
            {importResult.success ? (
              <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`font-medium ${importResult.success ? 'text-green-900' : 'text-red-900'}`}>
                {importResult.success ? 'Import Successful!' : 'Import Failed'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{importResult.message}</p>
              
              {importResult.summary && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(importResult.summary).map(([key, count]) => (
                    <div key={key} className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-900">{count}</div>
                      <div className="text-xs text-green-700 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-500">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
