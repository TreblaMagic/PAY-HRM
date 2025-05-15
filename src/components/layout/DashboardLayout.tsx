
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogOut, 
  Bell, 
  MessageSquare, 
  User, 
  Users, 
  Calendar, 
  ClipboardList, 
  TrendingUp, 
  FileText, 
  MessageCircle, 
  Settings, 
  Home as HomeIcon,
  Search
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
  activePage: 'dashboard' | 'employees' | 'attendance' | 'leave';
};

const DashboardLayout = ({ children, title, activePage }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <img src="/lovable-uploads/a1ae4194-76ca-4004-b465-1cfc43b5e20a.png" alt="BTEL Logo" className="h-8 w-8" />
          <div className="ml-2">
            <h1 className="text-xl font-bold text-gray-800">BTEL</h1>
            <h2 className="text-sm font-medium text-primary">HRM</h2>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 mb-4">MAIN</h3>
          <nav className="space-y-1">
            <Link 
              to="/dashboard" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activePage === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <HomeIcon className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link 
              to="/employees" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activePage === 'employees' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Employees
            </Link>
            <Link 
              to="/attendance" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activePage === 'attendance' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="mr-3 h-5 w-5" />
              Attendance
              {activePage !== 'attendance' && (
                <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
              )}
            </Link>
            <Link 
              to="/leave" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activePage === 'leave' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Leave Management
              {activePage !== 'leave' && (
                <span className="ml-auto bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
              )}
            </Link>
          </nav>
          
          <h3 className="text-xs font-semibold text-gray-400 mt-8 mb-4">HR MANAGEMENT</h3>
          <nav className="space-y-1">
            <Link to="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <FileText className="mr-3 h-5 w-5" />
              Payroll
            </Link>
            <Link to="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <TrendingUp className="mr-3 h-5 w-5" />
              Performance
            </Link>
            <Link to="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <FileText className="mr-3 h-5 w-5" />
              Documents
            </Link>
            <Link to="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <MessageCircle className="mr-3 h-5 w-5" />
              Announcements
            </Link>
          </nav>
          
          <h3 className="text-xs font-semibold text-gray-400 mt-8 mb-4">SETTINGS</h3>
          <nav className="space-y-1">
            <Link to="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <Settings className="mr-3 h-5 w-5" />
              General Settings
            </Link>
            <Link to="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <Users className="mr-3 h-5 w-5" />
              Roles & Permissions
            </Link>
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
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
              />
            </div>
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="relative">
              <MessageSquare className="h-6 w-6 text-gray-500 cursor-pointer" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center">
              <Link to="/profile" className="flex items-center space-x-2">
                <div className="bg-gray-200 rounded-full p-1">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700">{user?.user_metadata?.display_name || 'John Doe'}</p>
                  <p className="text-gray-500 text-xs">HR Manager</p>
                </div>
                <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
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
    </div>
  );
};

export default DashboardLayout;
