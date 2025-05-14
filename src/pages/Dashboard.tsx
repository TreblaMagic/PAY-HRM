import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  LogOut, Search, Bell, MessageSquare, User, Users, Calendar, 
  ClipboardList, TrendingUp, FileText, MessageCircle, Settings, Home as HomeIcon
} from 'lucide-react';
import { RecentEmployees } from "@/components/dashboard/RecentEmployees";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const stats = [
    { title: 'Total Employees', value: '248', icon: <Users className="h-6 w-6 text-primary" />, trend: '12% from last month', trendUp: true },
    { title: 'Today\'s Attendance', value: '92%', icon: <ClipboardList className="h-6 w-6 text-orange-500" />, trend: '3% from yesterday', trendUp: true },
    { title: 'On Leave Today', value: '12', icon: <Calendar className="h-6 w-6 text-rose-500" />, trend: '5% from last week', trendUp: true },
    { title: 'Payroll Processed', value: '₦24.5M', icon: <FileText className="h-6 w-6 text-violet-500" />, trend: '8% from last month', trendUp: true }
  ];

  const calendarDates = Array.from({ length: 35 }, (_, i) => {
    const day = i - 29; // Start from previous month
    return { day: day <= 0 ? 30 + day : day > 31 ? day - 31 : day, current: day > 0 && day <= 31 };
  });

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
            <Link to="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium bg-primary/10 text-primary rounded-md">
              <HomeIcon className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link to="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <Users className="mr-3 h-5 w-5" />
              Employees
            </Link>
            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <ClipboardList className="mr-3 h-5 w-5" />
              Attendance
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
            </div>
            <Link to="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              <Calendar className="mr-3 h-5 w-5" />
              Leave Management
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
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          <span className="text-gray-700">Dashboard</span>
        </div>
        
        {/* Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-gray-500 font-medium text-sm">{stat.title}</h3>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      <div className={`flex items-center mt-2 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                        <svg className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d={stat.trendUp ? "M12 7a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L12 4.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0112 7z" : "M12 13a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 15.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 13z"} clipRule="evenodd" />
                        </svg>
                        <span className="text-xs">{stat.trend}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-gray-100">
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Recent Employees and Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Employees */}
            <div className="lg:col-span-2">
              <RecentEmployees />
            </div>
            
            {/* Calendar */}
            <div>
              <Card>
                <CardHeader className="flex justify-between items-center px-6 pt-6 pb-4">
                  <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <h3 className="text-base font-medium mb-4">May 2023</h3>
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    <div className="text-xs font-medium text-gray-500">Sun</div>
                    <div className="text-xs font-medium text-gray-500">Mon</div>
                    <div className="text-xs font-medium text-gray-500">Tue</div>
                    <div className="text-xs font-medium text-gray-500">Wed</div>
                    <div className="text-xs font-medium text-gray-500">Thu</div>
                    <div className="text-xs font-medium text-gray-500">Fri</div>
                    <div className="text-xs font-medium text-gray-500">Sat</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm">
                    {calendarDates.map((date, i) => (
                      <div 
                        key={i} 
                        className={`aspect-square flex items-center justify-center rounded-md ${
                          !date.current ? 'text-gray-300' : 
                          date.day === 10 ? 'bg-primary text-white' : 
                          (date.day === 9 || date.day === 15 || date.day === 23) ? 'relative' : 
                          'hover:bg-gray-100'
                        }`}
                      >
                        {date.day}
                        {(date.day === 9 || date.day === 15 || date.day === 23) && 
                          <span className="absolute bottom-1 h-1 w-1 bg-primary rounded-full"></span>
                        }
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
