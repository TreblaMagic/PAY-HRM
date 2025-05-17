
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
        const role = await getCurrentUserRole();
        console.log('Current user role:', role);
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    } else {
      setUserRole(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('User changed, refreshing role');
    refreshRole();
  }, [user]);

  const hasPermission = (path: string): boolean => {
    // For debugging purposes
    console.log('hasPermission check:', { path, userRole, rolePermissions: userRole ? rolePermissions[userRole] : null });
    
    // If no role is set yet, deny access
    if (!userRole) {
      console.log('No user role set, denying access');
      return false;
    }
    
    // Always allow access to dashboard
    if (path === '/dashboard') {
      return true;
    }
    
    // Check if the user has permission to access this path based on their role
    if (rolePermissions[userRole]) {
      return rolePermissions[userRole].some(allowedPath => {
        // Exact match
        if (path === allowedPath) return true;
        
        // Path is a parent of allowedPath (e.g., /isp is a parent of /isp/settings)
        if (allowedPath.startsWith(path + '/')) return true;
        
        // Path is a child of allowedPath (e.g., /dashboard/analytics is a child of /dashboard)
        if (path.startsWith(allowedPath + '/')) return true;
        
        return false;
      });
    }
    
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
