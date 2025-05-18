
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
  const { hasPermission, loading: roleLoading, refreshRole, userRole } = useRole();
  
  useEffect(() => {
    console.log(`RoleBasedRoute for path ${path} mounted, user:`, user?.email);
    console.log('Current role state:', { userRole, loading: roleLoading });
    
    // Only refresh role when component mounts if user exists and no role is currently being loaded
    if (user && !roleLoading && !userRole) {
      console.log('Refreshing role in RoleBasedRoute for user:', user.email);
      refreshRole();
    }
  }, [user, path]); // Remove roleLoading and refreshRole from dependencies to avoid loops
  
  // Show loading spinner while checking auth
  if (authLoading) {
    console.log(`Auth still loading for path ${path}`);
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

  // During role loading, show spinner instead of redirecting
  // This is critical to prevent redirect loops
  if (roleLoading) {
    console.log(`Role still loading for path ${path}`);
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Special case for dashboard - always render it if we have a user
  // This prevents redirect loops
  if (path === '/dashboard') {
    console.log(`Rendering dashboard for user ${user.email} regardless of role`);
    return <Outlet />;
  }
  
  // Check if user has permission to access this path
  const permitted = hasPermission(path);
  
  if (!permitted) {
    console.log(`User ${user.email} does not have permission to access ${path}, redirecting to dashboard`);
    return <Navigate to="/dashboard" replace />;
  }
  
  // User has permission, allow access
  console.log(`User ${user.email} has permission to access ${path}, rendering content`);
  return <Outlet />;
};
