import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LeaveBalanceTable } from "@/components/leave/LeaveBalanceTable";
import { LeaveHistoryTable } from "@/components/leave/LeaveHistoryTable";
import { LeaveUpdateForm } from "@/components/leave/LeaveUpdateForm";
import { EmployeeLeaveBalance, LeaveRecord } from "@/types/leave";
import { getAllEmployees, updateEmployee } from "@/services/employeeService";
import { 
  calculateEmployeeLeaveBalances, 
  getAllLeaveRecords, 
  addLeaveRecord,
  deleteLeaveRecord
} from "@/services/leaveService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Employee } from "@/types/employee";

export default function LeaveManagement() {
  const { user, loading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [leaveBalances, setLeaveBalances] = useState<EmployeeLeaveBalance[]>([]);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployeesAndData();
  }, []);

  const fetchEmployeesAndData = async () => {
    setIsLoadingEmployees(true);
    try {
      const data = await getAllEmployees();
      const employeesArray = Array.isArray(data) ? data : [];
      setEmployees(employeesArray);
      
      const balances = await calculateEmployeeLeaveBalances();
      if (balances) {
        setLeaveBalances(balances);
      }
      
      const records = await getAllLeaveRecords();
      if (records) {
        setLeaveRecords(records);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
      setEmployees([]);
      setLeaveBalances([]);
      setLeaveRecords([]);
    } finally {
      setIsLoadingEmployees(false);
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchEmployeesAndData();
  };

  const handleUpdateLeave = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsUpdateFormOpen(true);
  };

  const handleUpdateLeaveDays = async (employeeId: string, newTotalDays: number) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee) return;
      
      await updateEmployee({ ...employee, leaveDaysAllocated: newTotalDays });
      
      await fetchEmployeesAndData();
      
      toast({
        title: "Success",
        description: "Leave days updated successfully"
      });
    } catch (error) {
      console.error('Error updating leave days:', error);
      toast({
        title: "Error",
        description: "Failed to update leave days",
        variant: "destructive"
      });
    }
  };

  const handleLeaveSubmit = async (data: {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string;
  }) => {
    try {
      const daysUsed = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      await addLeaveRecord({
        employeeId: data.employeeId,
        startDate: data.startDate,
        endDate: data.endDate,
        daysUsed,
        reason: data.reason,
        status: "Approved"
      });
      
      await fetchEmployeesAndData();
      setIsUpdateFormOpen(false);
      setSelectedEmployeeId(undefined);
    
      toast({
        title: "Success",
        description: "Leave request submitted successfully"
      });
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLeave = async (leaveId: string) => {
    try {
      await deleteLeaveRecord(leaveId);
      
      await fetchEmployeesAndData();
      
      toast({
        title: "Success",
        description: "Leave record deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting leave record:', error);
      toast({
        title: "Error",
        description: "Failed to delete leave record",
        variant: "destructive"
      });
    }
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
                  onUpdateLeaveDays={handleUpdateLeaveDays}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div>
                <h2 className="text-lg font-semibold mb-4">Leave History</h2>
                <LeaveHistoryTable 
                  leaveRecords={leaveRecords}
                  employees={employees}
                  onDeleteLeave={handleDeleteLeave}
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
