import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, MessageSquare, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Sidebar } from './Sidebar';
import { ProfileDropdown } from '@/components/ProfileDropdown';

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
  activePage?: string;
};

const DashboardLayout = ({ children, title, activePage }: DashboardLayoutProps) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar activePage={activePage} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-primary text-white border-b border-primary/20 p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
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
            </div>
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
    </div>
  );
};

export default DashboardLayout;
