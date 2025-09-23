'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Key } from 'lucide-react';
import { dbConfigOptions } from '@/config/database-options';

export default function PasswordTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{ [key: string]: { success: boolean; error?: string } }>({});
  const [currentTest, setCurrentTest] = useState<string>('');

  const testPassword = async (option: any) => {
    setTesting(true);
    setCurrentTest(option.name);
    
    try {
      const response = await fetch('/api/test-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(option.config),
      });
      
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        [option.name]: {
          success: data.success,
          error: data.error
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [option.name]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
  };

  const testAllPasswords = async () => {
    setResults({});
    for (const option of dbConfigOptions) {
      await testPassword(option);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          PostgreSQL Password Test
        </CardTitle>
        <CardDescription>
          Test different common PostgreSQL passwords to find the correct one
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testAllPasswords} 
            disabled={testing}
            className="flex-1"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test All Passwords'}
          </Button>
        </div>
        
        <div className="space-y-2">
          {dbConfigOptions.map((option) => (
            <div key={option.name} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                {currentTest === option.name ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                ) : results[option.name] ? (
                  results[option.name].success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                )}
                <div>
                  <p className="font-medium">{option.name}</p>
                  <p className="text-sm text-gray-500">Password: {option.config.password || '(empty)'}</p>
                </div>
              </div>
              <Button
                onClick={() => testPassword(option)}
                disabled={testing}
                variant="outline"
                size="sm"
              >
                Test
              </Button>
            </div>
          ))}
        </div>

        {Object.keys(results).length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(results).map(([name, result]) => (
                <div key={name} className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-700">{name}: ✅ Success!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-red-500" />
                      <span className="text-red-700">{name}: ❌ {result.error}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p><strong>Tip:</strong> Check your pgAdmin connection settings to find the correct password.</p>
          <p>Right-click your PostgreSQL server → Properties → Connection → Password</p>
        </div>
      </CardContent>
    </Card>
  );
}
