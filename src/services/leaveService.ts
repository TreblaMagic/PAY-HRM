import { LeaveRecord, EmployeeLeaveBalance, LeaveStatus } from "@/types/leave";
import { Employee } from "@/types/employee";
import { getAllEmployees } from "./employeeService";
import { supabase } from "@/lib/supabaseClient";

// Storage keys
const LEAVE_RECORDS_KEY = "leave_records";
const TOTAL_ANNUAL_LEAVE_DAYS = 30;

// Initialize leave records with sample data if empty
const initializeLeaveRecords = (): void => {
  if (!localStorage.getItem(LEAVE_RECORDS_KEY)) {
    const sampleLeaveRecords: LeaveRecord[] = [
      {
        id: "1",
        employeeId: "1",
        startDate: new Date("2024-05-01"),
        endDate: new Date("2024-05-05"),
        daysUsed: 5,
        reason: "Family vacation",
        status: "Approved" as LeaveStatus,
        createdAt: new Date("2024-04-15")
      },
      {
        id: "2",
        employeeId: "2",
        startDate: new Date("2024-04-10"),
        endDate: new Date("2024-04-12"),
        daysUsed: 3,
        reason: "Personal matters",
        status: "Approved" as LeaveStatus,
        createdAt: new Date("2024-04-01")
      },
      {
        id: "3",
        employeeId: "3",
        startDate: new Date("2024-06-20"),
        endDate: new Date("2024-06-25"),
        daysUsed: 6,
        reason: "Summer break",
        status: "Pending" as LeaveStatus,
        createdAt: new Date("2024-05-30")
      }
    ];
    localStorage.setItem(LEAVE_RECORDS_KEY, JSON.stringify(sampleLeaveRecords));
  }
};

// Get all leave records
export const getAllLeaveRecords = async (): Promise<LeaveRecord[]> => {
  const { data, error } = await supabase
    .from('leave_records')
    .select(`
      id,
      employee_id,
      start_date,
      end_date,
      days_used,
      reason,
      status,
      created_at,
      employees (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leave records:', error);
    throw error;
  }

  return data.map(record => ({
    id: record.id,
    employeeId: record.employee_id,
    startDate: new Date(record.start_date),
    endDate: new Date(record.end_date),
    daysUsed: record.days_used,
    reason: record.reason,
    status: record.status as LeaveStatus,
    createdAt: new Date(record.created_at)
  }));
};

// Get leave records for a specific employee
export const getEmployeeLeaveRecords = async (employeeId: string): Promise<LeaveRecord[]> => {
  const { data, error } = await supabase
    .from('leave_records')
    .select(`
      id,
      employee_id,
      start_date,
      end_date,
      days_used,
      reason,
      status,
      created_at
    `)
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching employee leave records:', error);
    throw error;
  }

  return data.map(record => ({
    id: record.id,
    employeeId: record.employee_id,
    startDate: new Date(record.start_date),
    endDate: new Date(record.end_date),
    daysUsed: record.days_used,
    reason: record.reason,
    status: record.status as LeaveStatus,
    createdAt: new Date(record.created_at)
  }));
};

// Calculate leave balance for each employee
export const calculateEmployeeLeaveBalances = async (): Promise<EmployeeLeaveBalance[]> => {
  const { data: employees, error: employeesError } = await supabase
    .from('employees')
    .select('id, name, leave_days_allocated');

  if (employeesError) {
    console.error('Error fetching employees:', employeesError);
    throw employeesError;
  }

  const { data: leaveRecords, error: leaveError } = await supabase
    .from('leave_records')
    .select('employee_id, days_used, status')
    .eq('status', 'Approved');

  if (leaveError) {
    console.error('Error fetching leave records:', leaveError);
    throw leaveError;
  }

  return employees.map(employee => {
    const usedDays = leaveRecords
      .filter(record => record.employee_id === employee.id)
      .reduce((total, record) => total + record.days_used, 0);

    return {
      employeeId: employee.id,
      employeeName: employee.name,
      totalDays: employee.leave_days_allocated || 0,
      usedDays,
      remainingDays: (employee.leave_days_allocated || 0) - usedDays
    };
  });
};

// Add new leave record
export const addLeaveRecord = async (record: Omit<LeaveRecord, "id" | "createdAt">): Promise<LeaveRecord> => {
  const { data, error } = await supabase
    .from('leave_records')
    .insert([{
      employee_id: record.employeeId,
      start_date: record.startDate.toISOString().split('T')[0],
      end_date: record.endDate.toISOString().split('T')[0],
      days_used: record.daysUsed,
      reason: record.reason,
      status: record.status
    }])
    .select(`
      id,
      employee_id,
      start_date,
      end_date,
      days_used,
      reason,
      status,
      created_at,
      employees (
        name
      )
    `)
    .single();

  if (error) {
    console.error('Error adding leave record:', error);
    throw error;
  }

  return {
    id: data.id,
    employeeId: data.employee_id,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    daysUsed: data.days_used,
    reason: data.reason,
    status: data.status as LeaveStatus,
    createdAt: new Date(data.created_at)
  };
};

// Update leave record
export const updateLeaveRecord = async (leaveRecord: LeaveRecord): Promise<LeaveRecord | null> => {
  const { data, error } = await supabase
    .from('leave_records')
    .update({
      employee_id: leaveRecord.employeeId,
      start_date: leaveRecord.startDate.toISOString().split('T')[0],
      end_date: leaveRecord.endDate.toISOString().split('T')[0],
      days_used: leaveRecord.daysUsed,
      reason: leaveRecord.reason,
      status: leaveRecord.status
    })
    .eq('id', leaveRecord.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating leave record:', error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    employeeId: data.employee_id,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    daysUsed: data.days_used,
    reason: data.reason,
    status: data.status as LeaveStatus,
    createdAt: new Date(data.created_at)
  };
};

// Delete leave record
export const deleteLeaveRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('leave_records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting leave record:', error);
    throw error;
  }
};
