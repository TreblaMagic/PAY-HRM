
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Users, ClipboardList, Calendar, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function DocumentsSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
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
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/employees')}
          >
            <Users className="mr-3 h-5 w-5" />
            Employees
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/attendance')}
          >
            <ClipboardList className="mr-3 h-5 w-5" />
            Attendance
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/leave')}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Leave Management
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start bg-primary/10 text-primary"
            onClick={() => navigate('/documents')}
          >
            <FileText className="mr-3 h-5 w-5" />
            Documents
          </Button>
        </nav>
        
        <h3 className="text-xs font-semibold text-gray-400 mt-8 mb-4">SETTINGS</h3>
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={signOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </nav>
      </div>
    </aside>
  );
}
