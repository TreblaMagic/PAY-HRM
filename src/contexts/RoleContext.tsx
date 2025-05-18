
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserRole, rolePermissions } from '@/types/role';
import { getCurrentUserRole } from '@/services/roleService';
import { useAuth } from './AuthContext';

type RoleContextType = {
  userRole: UserRole | null;
  loading: boolean;
  hasPermission: (path: string) => boolean;
  refreshRole: () => Promise<void>;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshRole = async () => {
    if (user) {
      try {
        setLoading(true);
        console.log(`Fetching role for user ID: ${user.id}, email: ${user.email}`);
        const role = await getCurrentUserRole();
        console.log('Current user role retrieved:', role);
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('No user logged in, setting role to null');
      setUserRole(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('User changed in RoleContext, refreshing role');
    refreshRole();
  }, [user]);

  const hasPermission = (path: string): boolean => {
    // For debugging purposes
    console.log('hasPermission check:', { path, userRole, permissionsForRole: userRole ? rolePermissions[userRole] : 'No role' });
    
    // Special case: if no role is set but user exists, we're still loading
    if (!userRole && user && loading) {
      console.log('Role still loading, allowing access temporarily');
      return true;
    }
    
    // If no role is set and we're done loading, deny access
    if (!userRole && !loading) {
      console.log('No user role set, denying access');
      return false;
    }
    
    // Always allow access to dashboard
    if (path === '/dashboard') {
      console.log('Dashboard access granted');
      return true;
    }
    
    // Check if the user has permission to access this path based on their role
    if (userRole && rolePermissions[userRole]) {
      const hasAccess = rolePermissions[userRole].some(allowedPath => {
        // Exact match
        if (path === allowedPath) return true;
        
        // Path is a parent of allowedPath (e.g., /isp is a parent of /isp/settings)
        if (allowedPath.startsWith(path + '/')) return true;
        
        // Path is a child of allowedPath (e.g., /dashboard/analytics is a child of /dashboard)
        if (path.startsWith(allowedPath + '/')) return true;
        
        return false;
      });
      
      console.log(`Access to ${path} for role ${userRole}: ${hasAccess ? 'granted' : 'denied'}`);
      return hasAccess;
    }
    
    console.log(`No permissions defined for role ${userRole}, denying access`);
    return false;
  };

  return (
    <RoleContext.Provider value={{ userRole, loading, hasPermission, refreshRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
