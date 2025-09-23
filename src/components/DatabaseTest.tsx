'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function DatabaseTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  const testSites = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();
      setResult({
        success: data.success,
        message: data.success ? `Found ${data.data?.length || 0} sites` : data.error,
        error: data.success ? undefined : data.error
      });
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
        <CardDescription>
          Test your PostgreSQL database connection and data retrieval
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testConnection} 
            disabled={testing}
            variant="outline"
            className="flex-1"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Connection'}
          </Button>
          <Button 
            onClick={testSites} 
            disabled={testing}
            variant="outline"
            className="flex-1"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Sites'}
          </Button>
        </div>
        
        {result && (
          <div className={`p-3 rounded-md flex items-center gap-2 ${
            result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <div>
              <p className="font-medium">
                {result.success ? 'Success!' : 'Error'}
              </p>
              <p className="text-sm">
                {result.message || result.error}
              </p>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>Make sure your PostgreSQL server is running and the database connection is configured correctly.</p>
          <p>Update the database password in <code>src/config/database.ts</code></p>
        </div>
      </CardContent>
    </Card>
  );
}
