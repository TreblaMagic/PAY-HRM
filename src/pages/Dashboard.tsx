
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold">BTEL</span>
              <span className="ml-1 text-2xl font-bold text-accent">.</span>
              <span className="ml-4 text-lg">Dashboard</span>
            </div>
            <Button variant="ghost" className="text-white hover:bg-primary/80" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.email}</h1>
          <p className="text-gray-600 mt-2">
            This is your employee dashboard where you can manage your tasks and attendance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">ID:</span> {user.id.substring(0, 8)}...</p>
                <Button variant="outline" className="mt-4 w-full">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Track your work hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Today's Status:</span>
                <span className="text-green-500 font-medium">Present</span>
              </div>
              <div className="flex justify-between">
                <Button variant="default">Clock In</Button>
                <Button variant="outline">Clock Out</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Your pending tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Update documentation</p>
                  <p className="text-sm text-gray-500">Due: Today</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Weekly team meeting</p>
                  <p className="text-sm text-gray-500">Due: Tomorrow</p>
                </div>
                <Button variant="outline" className="mt-2 w-full">View All Tasks</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
