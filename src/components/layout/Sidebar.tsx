import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Calendar, 
  CreditCard,
  BarChart2,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';

type SidebarProps = {
  activePage?: string;
};

export function Sidebar({ activePage }: SidebarProps) {
  const { signOut } = useAuth();
  const { hasPermission, userRole } = useRole();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Check if a path is active (exact match or sub-path)
  const isActive = (path: string) => {
    if (activePage) {
      return path.includes(activePage);
    }
    
    if (path === '/dashboard' && currentPath === '/dashboard') {
      return true;
    }
    return path !== '/dashboard' && currentPath.startsWith(path);
  };
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <img src="/lovable-uploads/a1ae4194-76ca-4004-b465-1cfc43b5e20a.png" alt="BTEL Logo" className="h-8 w-8" />
        <div className="ml-2">
          <h1 className="text-xl font-bold text-gray-800">BTEL</h1>
          <h2 className="text-sm font-medium text-primary">HRM</h2>
        </div>
      </div>
      
      <div className="p-4">
        {/* HR MANAGEMENT SECTION */}
        <h3 className="text-xs font-semibold text-gray-400 mb-4">HR MANAGEMENT</h3>
        <nav className="space-y-1">
          {hasPermission('/dashboard') && (
            <Link 
              to="/dashboard" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
          )}
          
          {hasPermission('/employees') && (
            <Link 
              to="/employees" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/employees') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Employees
            </Link>
          )}
          
          {hasPermission('/attendance') && (
            <Link 
              to="/attendance" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/attendance') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="mr-3 h-5 w-5" />
              Attendance
              {!isActive('/attendance') && (
                <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
              )}
            </Link>
          )}
          
          {hasPermission('/leave') && (
            <Link 
              to="/leave" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/leave') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Leave Management
            </Link>
          )}
        </nav>
        
        {/* FINANCE MANAGEMENT SECTION */}
        <h3 className="text-xs font-semibold text-gray-400 mt-8 mb-4">
          FINANCE MANAGEMENT
        </h3>
        <nav className="space-y-1">
          {hasPermission('/payroll') && (
            <Link 
              to="/payroll" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/payroll') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Payroll
            </Link>
          )}
          
          {hasPermission('/isp') && (
            <Link 
              to="/isp" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/isp') && !isActive('/isp/settings') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="mr-3 h-5 w-5" />
              ISP
            </Link>
          )}
          
          {hasPermission('/documents') && (
            <Link 
              to="/documents" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/documents') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="mr-3 h-5 w-5" />
              Documents
            </Link>
          )}
          
          {hasPermission('/isp/settings') && (
            <Link 
              to="/isp/settings" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/isp/settings') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              ISP Settings
            </Link>
          )}
        </nav>
        
        {/* SETTINGS SECTION */}
        <h3 className="text-xs font-semibold text-gray-400 mt-8 mb-4">SETTINGS</h3>
        <nav className="space-y-1">
          {userRole === 'IT' && hasPermission('/roles-permissions') && (
            <Link 
              to="/roles-permissions" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/roles-permissions') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Roles & Permissions
            </Link>
          )}
          <button 
            onClick={signOut}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}
