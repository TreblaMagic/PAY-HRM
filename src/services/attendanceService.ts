
import { Attendance, AttendanceStatus, DateRange } from "@/types/attendance";
import { Employee } from "@/types/employee";
import { getAllEmployees } from "./employeeService";

// Storage key for attendance
const STORAGE_KEY = "attendance";

// Initialize with some sample data if empty
const initializeAttendance = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const employees = getAllEmployees();
    if (employees.length > 0) {
      const sampleAttendance: Attendance[] = [
        {
          id: "1",
          employeeId: employees[0].id,
          employeeName: employees[0].name,
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
          status: "On Time"
        },
        {
          id: "2",
          employeeId: employees[1]?.id || employees[0].id,
          employeeName: employees[1]?.name || employees[0].name,
          date: new Date().toISOString().split('T')[0], // Today
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
export const getAllAttendance = (): Attendance[] => {
  initializeAttendance();
  const attendance = localStorage.getItem(STORAGE_KEY);
  return attendance ? JSON.parse(attendance) : [];
};

// Get attendance by date range
export const getAttendanceByDateRange = ({ startDate, endDate }: DateRange): Attendance[] => {
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
export const addAttendance = (employeeId: string, date: string, status: AttendanceStatus): Attendance => {
  const attendance = getAllAttendance();
  const employees = getAllEmployees();
  const employee = employees.find(emp => emp.id === employeeId);
  
  if (!employee) {
    throw new Error("Employee not found");
  }
  
  // Check if there's already an attendance for this employee on this date
  const existingIndex = attendance.findIndex(
    a => a.employeeId === employeeId && a.date === date
  );
  
  const newAttendance: Attendance = {
    id: existingIndex >= 0 ? attendance[existingIndex].id : Date.now().toString(),
    employeeId,
    employeeName: employee.name,
    date,
    status
  };
  
  if (existingIndex >= 0) {
    // Update existing record
    attendance[existingIndex] = newAttendance;
  } else {
    // Add new record
    attendance.push(newAttendance);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attendance));
  return newAttendance;
};

// Get attendance by date
export const getAttendanceByDate = (date: string): Attendance[] => {
  const attendance = getAllAttendance();
  return attendance.filter(record => record.date === date);
};

// Delete attendance
export const deleteAttendance = (id: string): boolean => {
  const attendance = getAllAttendance();
  const filteredAttendance = attendance.filter(record => record.id !== id);
  
  if (filteredAttendance.length === attendance.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAttendance));
  return true;
};
