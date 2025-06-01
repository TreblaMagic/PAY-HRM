import React, { useEffect, useState } from "react";
import { LeaveRecord, EmployeeLeaveBalance } from "@/types/leave";
import { Employee } from "@/types/employee";
import { getAllEmployees } from "@/services/employeeService";
import {
  calculateEmployeeLeaveBalances,
  getAllLeaveRecords,
  addLeaveRecord,
  deleteLeaveRecord,
} from "@/services/leaveService";
import { LeaveBalanceTable } from "./LeaveBalanceTable";
import { LeaveHistoryTable } from "./LeaveHistoryTable";
import { LeaveRequestForm } from "./LeaveRequestForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LeaveManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<EmployeeLeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeesAndData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch employees
      const fetchedEmployees = await getAllEmployees();
      setEmployees(fetchedEmployees);

      // Fetch leave records
      const fetchedLeaveRecords = await getAllLeaveRecords();
      setLeaveRecords(fetchedLeaveRecords);

      // Calculate leave balances
      const balances = await calculateEmployeeLeaveBalances();
      setLeaveBalances(balances);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesAndData();
  }, []);

  const handleLeaveRequest = async (newRecord: Omit<LeaveRecord, "id" | "createdAt">) => {
    try {
      await addLeaveRecord(newRecord);
      await fetchEmployeesAndData();
    } catch (err) {
      console.error('Error handling leave request:', err);
      setError('Failed to process leave request. Please try again.');
    }
  };

  const handleUpdateLeave = (employeeId: string) => {
    // TODO: Implement leave update logic
    console.log('Update leave for employee:', employeeId);
  };

  const handleUpdateLeaveDays = async (employeeId: string, newTotalDays: number) => {
    try {
      // TODO: Implement leave days update logic
      console.log('Update leave days for employee:', employeeId, 'to', newTotalDays);
      await fetchEmployeesAndData();
    } catch (err) {
      console.error('Error updating leave days:', err);
      setError('Failed to update leave days. Please try again.');
    }
  };

  const handleDeleteLeave = async (leaveId: string) => {
    try {
      await deleteLeaveRecord(leaveId);
      await fetchEmployeesAndData();
    } catch (err) {
      console.error('Error deleting leave record:', err);
      setError('Failed to delete leave record. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Leave Management</h1>
      
      <Tabs defaultValue="balance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="balance">Leave Balance</TabsTrigger>
          <TabsTrigger value="history">Leave History</TabsTrigger>
          <TabsTrigger value="request">Request Leave</TabsTrigger>
        </TabsList>

        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <CardTitle>Leave Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaveBalanceTable 
                leaveBalances={leaveBalances}
                onUpdateLeave={handleUpdateLeave}
                onUpdateLeaveDays={handleUpdateLeaveDays}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaveHistoryTable
                leaveRecords={leaveRecords}
                employees={employees}
                onDeleteLeave={handleDeleteLeave}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle>Request Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaveRequestForm
                employees={employees}
                onSubmit={handleLeaveRequest}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 