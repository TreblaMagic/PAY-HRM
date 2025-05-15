
import React from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  LogOut,
  Bell,
  MessageSquare,
  Users,
  Calendar,
  ClipboardList,
  TrendingUp,
  FileText,
  MessageCircle,
  Settings,
  Home as HomeIcon
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

export function EmployeesSidebar() {
  const { signOut } = useAuth();

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
        <h3 className="text-xs font-semibold text-gray-400 mb-4">MAIN</h3>
        <nav className="space-y-1">
          <Link to="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
            <HomeIcon className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/employees" className="flex items-center px-3 py-2 text-sm font-medium bg-primary/10 text-primary rounded-md">
            <Users className="mr-3 h-5 w-5" />
            Employees
          </Link>
          <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
            <ClipboardList className="mr-3 h-5 w-5" />
            Attendance
            <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
          </div>
          <Link to="/leave" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
            <Calendar className="mr-3 h-5 w-5" />
            Leave Management
          </Link>
        </nav>
        
        <h3 className="text-xs font-semibold text-gray-400 mt-8 mb-4">HR MANAGEMENT</h3>
        <nav className="space-y-1">
          <Link to="/payroll" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
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
  );
}
