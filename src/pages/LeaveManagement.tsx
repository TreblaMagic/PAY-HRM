
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LeaveBalanceTable } from "@/components/leave/LeaveBalanceTable";
import { LeaveHistoryTable } from "@/components/leave/LeaveHistoryTable";
import { LeaveUpdateForm } from "@/components/leave/LeaveUpdateForm";
import { EmployeeLeaveBalance, LeaveRecord } from "@/types/leave";
import { getAllEmployees } from "@/services/employeeService";
import { 
  calculateEmployeeLeaveBalances, 
  getAllLeaveRecords, 
  addLeaveRecord 
} from "@/services/leaveService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

export default function LeaveManagement() {
  const { user, loading } = useAuth();
  const [employees, setEmployees] = useState(getAllEmployees());
  const [leaveBalances, setLeaveBalances] = useState<EmployeeLeaveBalance[]>([]);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Load initial data
    refreshData();
  }, []);

  const refreshData = () => {
    const employees = getAllEmployees();
    setEmployees(employees);
    setLeaveBalances(calculateEmployeeLeaveBalances());
    setLeaveRecords(getAllLeaveRecords());
  };

  const handleUpdateLeave = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsUpdateFormOpen(true);
  };

  const handleLeaveSubmit = (data: {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string;
  }) => {
    // Calculate days difference
    const diffTime = Math.abs(data.endDate.getTime() - data.startDate.getTime());
    const daysUsed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

    // Create leave record
    const newLeaveRecord = {
      employeeId: data.employeeId,
      startDate: data.startDate,
      endDate: data.endDate,
      daysUsed,
      reason: data.reason,
      status: "Approved" as const
    };

    // Add to storage
    addLeaveRecord(newLeaveRecord);
    
    // Refresh data
    refreshData();
    
    // Close form and reset selected employee
    setIsUpdateFormOpen(false);
    setSelectedEmployeeId(undefined);
    
    // Show success toast
    toast({
      title: "Leave Updated",
      description: `Leave record has been successfully added.`,
    });
  };

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
    <DashboardLayout title="Leave Management" activePage="leave">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave allowances and records</p>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Leave History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Employees</CardTitle>
                    <CardDescription>Active employees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{employees.length}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Leave Days Used</CardTitle>
                    <CardDescription>Across all employees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {leaveBalances.reduce((total, balance) => total + balance.usedDays, 0)}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pending Leaves</CardTitle>
                    <CardDescription>Awaiting approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {leaveRecords.filter(record => record.status === "Pending").length}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Employee Leave Balances</h2>
                <LeaveBalanceTable 
                  leaveBalances={leaveBalances}
                  onUpdateLeave={handleUpdateLeave}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div>
                <h2 className="text-lg font-semibold mb-4">Leave History</h2>
                <LeaveHistoryTable 
                  leaveRecords={leaveRecords}
                  employees={employees}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <LeaveUpdateForm
          isOpen={isUpdateFormOpen}
          onClose={() => {
            setIsUpdateFormOpen(false);
            setSelectedEmployeeId(undefined);
          }}
          onSubmit={handleLeaveSubmit}
          selectedEmployeeId={selectedEmployeeId}
          employees={employees}
        />
      </div>
    </DashboardLayout>
  );
}
