import React, { useEffect, useState } from 'react';
import { debugUserRole } from '@/services/roleService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const RoleDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkRole = async () => {
    try {
      setLoading(true);
      const info = await debugUserRole();
      setDebugInfo(info);
      
      if (info.error) {
        toast({
          title: 'Error',
          description: info.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error checking role:', error);
      toast({
        title: 'Error',
        description: 'Failed to check role information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkRole();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Debug Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={checkRole} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Checking...' : 'Refresh Debug Info'}
        </Button>

        {debugInfo && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Session Information</h3>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
                {JSON.stringify(debugInfo.session, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">Role Information</h3>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
                {JSON.stringify(debugInfo.role, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">Permissions</h3>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
                {JSON.stringify(debugInfo.permissions, null, 2)}
              </pre>
            </div>

            {debugInfo.error && (
              <div>
                <h3 className="font-medium mb-2 text-red-600">Error</h3>
                <pre className="bg-red-50 p-3 rounded-md text-sm text-red-600 overflow-auto">
                  {debugInfo.error}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 