
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, MessageSquare, User, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Sidebar } from './Sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
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
