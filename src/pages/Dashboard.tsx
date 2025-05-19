
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { RecentEmployees } from "@/components/dashboard/RecentEmployees";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRole } from '@/contexts/RoleContext';
import { getAllEmployees } from '@/services/employeeService';
import { getAllAttendance } from '@/services/attendanceService';
import { getAllLeaveRecords } from '@/services/leaveService';
import { formatCurrency } from '@/utils/formatters';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: roleLoading } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    todayAttendance: 0,
    onLeaveToday: 0,
    payrollProcessed: 0
  });

  useEffect(() => {
    console.log('Dashboard component rendered', { user });
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = () => {
    // Get total employees
    const employees = getAllEmployees();
    
    // Get today's attendance
    const attendanceRecords = getAllAttendance();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    }).length;
    
    // Get employees on leave today
    const leaveRecords = getAllLeaveRecords();
    const onLeaveToday = leaveRecords.filter(record => {
      const startDate = new Date(record.startDate);
      const endDate = new Date(record.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return (
        record.status === "Approved" &&
        today >= startDate &&
        today <= endDate
      );
    }).length;
    
    // Calculate total payroll processed
    const totalSalaries = employees.reduce((total, emp) => total + emp.salary, 0);
    
    setDashboardData({
      totalEmployees: employees.length,
      todayAttendance,
      onLeaveToday,
      payrollProcessed: totalSalaries
    });
  };

  // If still loading, show a spinner
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Rendering dashboard content');

  const stats = [
    { 
      title: 'Total Employees', 
      value: dashboardData.totalEmployees.toString(), 
      icon: 'users', 
      trend: '12% from last month', 
      trendUp: true 
    },
    { 
      title: 'Today\'s Attendance', 
      value: `${dashboardData.todayAttendance > 0 
        ? Math.round((dashboardData.todayAttendance / dashboardData.totalEmployees) * 100) 
        : 0}%`, 
      icon: 'clipboard', 
      trend: '3% from yesterday', 
      trendUp: true 
    },
    { 
      title: 'On Leave Today', 
      value: dashboardData.onLeaveToday.toString(), 
      icon: 'calendar', 
      trend: '5% from last week', 
      trendUp: true 
    },
    { 
      title: 'Payroll Processed', 
      value: formatCurrency(dashboardData.payrollProcessed), 
      icon: 'file', 
      trend: '8% from last month', 
      trendUp: true 
    }
  ];

  const calendarDates = Array.from({ length: 35 }, (_, i) => {
    const day = i - 29; // Start from previous month
    return { day: day <= 0 ? 30 + day : day > 31 ? day - 31 : day, current: day > 0 && day <= 31 };
  });

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'users':
        return <div className="p-3 rounded-full bg-gray-100"><svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>;
      case 'clipboard':
        return <div className="p-3 rounded-full bg-gray-100"><svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>;
      case 'calendar':
        return <div className="p-3 rounded-full bg-gray-100"><svg className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>;
      case 'file':
        return <div className="p-3 rounded-full bg-gray-100"><svg className="h-6 w-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-8">
        <div className="mb-6">
          <div className="w-full md:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
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
                  {renderIcon(stat.icon)}
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
              <CardContent className="px-6 py-6">
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
    </DashboardLayout>
  );
};

export default Dashboard;
