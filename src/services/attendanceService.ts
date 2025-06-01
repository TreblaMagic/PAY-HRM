import { AttendanceRecord, AttendanceStatus } from "@/types/attendance";
import { Employee } from "@/types/employee";
import { getAllEmployees } from "./employeeService";
import { supabase } from "@/lib/supabaseClient";

// Storage key for attendance
const STORAGE_KEY = "attendance";

// Initialize with some sample data if empty
const initializeAttendance = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const employees = getAllEmployees();
    if (employees.length > 0) {
      const sampleAttendance: AttendanceRecord[] = [
        {
          id: "1",
          employeeId: employees[0].id,
          employeeName: employees[0].name,
          date: new Date(Date.now() - 86400000), // Yesterday
          status: "On Time"
        },
        {
          id: "2",
          employeeId: employees[1]?.id || employees[0].id,
          employeeName: employees[1]?.name || employees[0].name,
          date: new Date(), // Today
          status: "Late"
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleAttendance));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }
};

// Get all attendance records
export const getAllAttendance = async (): Promise<AttendanceRecord[]> => {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      id,
      employee_id,
      date,
      status,
      employees (
        name
      )
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }

  return data.map(record => ({
    id: record.id,
    employeeId: record.employee_id,
    employeeName: record.employees.name,
    date: new Date(record.date),
    status: record.status as AttendanceStatus
  }));
};

// Get attendance by date range
export const getAttendanceByDateRange = async (startDate: Date, endDate: Date): Promise<AttendanceRecord[]> => {
  if (!startDate || !endDate) return [];
  
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      id,
      employee_id,
      date,
      status,
      employees (
        name
      )
    `)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching attendance records by date range:', error);
    throw error;
  }

  return data.map(record => ({
    id: record.id,
    employeeId: record.employee_id,
    employeeName: record.employees.name,
    date: new Date(record.date),
    status: record.status as AttendanceStatus
  }));
};

// Add attendance
export const addAttendance = async (record: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> => {
  const { data, error } = await supabase
    .from('attendance')
    .insert([{
      employee_id: record.employeeId,
      date: record.date.toISOString().split('T')[0],
      status: record.status
    }])
    .select(`
      id,
      employee_id,
      date,
      status,
      employees (
        name
      )
    `)
    .single();

  if (error) {
    console.error('Error adding attendance record:', error);
    throw error;
  }

  return {
    id: data.id,
    employeeId: data.employee_id,
    employeeName: data.employees.name,
    date: new Date(data.date),
    status: data.status as AttendanceStatus
  };
};

// Delete attendance
export const deleteAttendance = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting attendance record:', error);
    throw error;
  }
};

