
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { Spinner } from '@/components/ui/spinner';

type RoleBasedRouteProps = {
  path: string;
};

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ path }) => {
  const { user, loading: authLoading } = useAuth();
  const { hasPermission, loading: roleLoading } = useRole();
  
  // Show loading spinner while checking auth and role
  if (authLoading || roleLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // If user doesn't have permission for this route, redirect to dashboard
  if (!hasPermission(path)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // User has permission, render the route
  return <Outlet />;
};
