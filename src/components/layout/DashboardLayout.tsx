import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, MessageSquare, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
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
  LogOut,
} from 'lucide-react';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
  activePage?: string;
};

const DashboardLayout = ({ children, title, activePage }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const { hasPermission, userRole } = useRole();
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if a path is active (exact match or sub-path)
  const isActive = (path) => {
    if (activePage) {
      return path.includes(activePage);
    }
    if (path === '/dashboard' && currentPath === '/dashboard') {
      return true;
    }
    return path !== '/dashboard' && currentPath.startsWith(path);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <div className="p-4 border-b border-gray-200 flex items-center">
            <img
              src="/lovable-uploads/a1ae4194-76ca-4004-b465-1cfc43b5e20a.png"
              alt="BTEL Logo"
              className="h-8 w-8"
            />
            <div className="ml-2">
              <h1 className="text-xl font-bold text-gray-800">BTEL</h1>
              <h2 className="text-sm font-medium text-primary">HRM</h2>
            </div>
          </div>
          <nav className="space-y-1 mt-6">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/dashboard')
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/employees"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/employees')
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Employees
            </Link>
            <Link
              to="/attendance"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/attendance')
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="mr-3 h-5 w-5" />
              Attendance
            </Link>
            {hasPermission('/leave') && (
              <Link
                to="/leave"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/leave')
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
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
                  isActive('/payroll')
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
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
                  isActive('/isp') && !isActive('/isp/settings')
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
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
                  isActive('/documents')
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
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
                  isActive('/isp/settings')
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                ISP Settings
              </Link>
            )}
          </nav>

          {/* SETTINGS SECTION */}
          <h3 className="text-xs font-semibold text-gray-400 mt-8 mb-4">
            SETTINGS
          </h3>
          <nav className="space-y-1">
            {userRole === 'IT' && hasPermission('/roles-permissions') && (
              <Link
                to="/roles-permissions"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/roles-permissions')
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
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
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 overflow-auto">
        <header className="bg-primary text-white border-b border-primary/20 p-4 flex justify-between items-center sticky top-0 z-10">
          {/* Hamburger for mobile */}
          <div className="md:hidden mr-2">
            <SidebarTrigger />
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/70" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border-0 bg-white/10 text-white placeholder:text-white/70 rounded-md w-full focus-visible:ring-white/20"
              />
            </div>
            <div className="relative">
              <Bell className="h-6 w-6 text-white/90 cursor-pointer hover:text-white" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="relative">
              <MessageSquare className="h-6 w-6 text-white/90 cursor-pointer hover:text-white" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div> */}
            <Separator orientation="vertical" className="h-8 bg-white/20" />
            <ProfileDropdown />
          </div>
        </header>
        
        {/* Breadcrumbs */}
        <div className="bg-white px-8 py-4 text-sm flex items-center space-x-2">
          <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">{title}</span>
        </div>
        
        {/* Page Content */}
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
