
import { AttendanceRecord, AttendanceStatus } from "@/types/attendance";
import { Employee } from "@/types/employee";
import { getAllEmployees } from "./employeeService";

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
export const getAllAttendance = (): AttendanceRecord[] => {
  initializeAttendance();
  const attendance = localStorage.getItem(STORAGE_KEY);
  const records = attendance ? JSON.parse(attendance) : [];
  
  // Convert date strings back to Date objects
  return records.map((record: any) => ({
    ...record,
    date: new Date(record.date)
  }));
};

// Get attendance by date range
export const getAttendanceByDateRange = (startDate: Date, endDate: Date): AttendanceRecord[] => {
  if (!startDate || !endDate) return [];
  
  const attendance = getAllAttendance();
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return attendance.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= start && recordDate <= end;
  });
};

// Add attendance
export const addAttendance = (record: AttendanceRecord): AttendanceRecord => {
  const attendance = getAllAttendance();
  
  // Check if there's already an attendance for this employee on this date
  const existingIndex = attendance.findIndex(
    a => a.employeeId === record.employeeId && 
    a.date.toDateString() === record.date.toDateString()
  );
  
  if (existingIndex >= 0) {
    // Update existing record
    attendance[existingIndex] = record;
  } else {
    // Add new record
    attendance.push(record);
  }
  
  // Convert dates to strings for storage
  const recordsToStore = attendance.map(record => ({
    ...record,
    date: record.date.toISOString()
  }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordsToStore));
  return record;
};

// Delete attendance
export const deleteAttendance = (id: string): boolean => {
  const attendance = getAllAttendance();
  const filteredAttendance = attendance.filter(record => record.id !== id);
  
  if (filteredAttendance.length === attendance.length) return false;
  
  // Convert dates to strings for storage
  const recordsToStore = filteredAttendance.map(record => ({
    ...record,
    date: record.date.toISOString()
  }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordsToStore));
  return true;
};

