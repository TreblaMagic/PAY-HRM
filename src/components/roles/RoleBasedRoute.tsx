
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { Spinner } from '@/components/ui/spinner';

type RoleBasedRouteProps = {
  path: string;
};

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ path }) => {
  const { user, loading: authLoading } = useAuth();
  const { hasPermission, loading: roleLoading, refreshRole } = useRole();
  
  useEffect(() => {
    console.log(`RoleBasedRoute for path ${path} mounted`);
    
    // Refresh role when component mounts to ensure we have the latest role data
    if (user && !roleLoading) {
      console.log('Refreshing role in RoleBasedRoute');
      refreshRole();
    }
  }, [path, user]);
  
  // Show loading spinner while checking auth and role
  if (authLoading || roleLoading) {
    console.log(`Loading state for path ${path}: auth loading=${authLoading}, role loading=${roleLoading}`);
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  // If user is not logged in, redirect to login page
  if (!user) {
    console.log(`User is not logged in, redirecting from ${path} to /`);
    return <Navigate to="/" replace />;
  }
  
  // Check if user has permission to access this path
  const permitted = hasPermission(path);
  
  if (!permitted) {
    console.log(`User does not have permission to access ${path}, redirecting to dashboard`);
    return <Navigate to="/dashboard" replace />;
  }
  
  // User has permission, allow access
  console.log(`User has permission to access ${path}, rendering content`);
  return <Outlet />;
};
