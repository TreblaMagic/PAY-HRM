
import { LeaveRecord, EmployeeLeaveBalance } from "@/types/leave";
import { Employee } from "@/types/employee";
import { getAllEmployees } from "./employeeService";

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
        status: "Approved",
        createdAt: new Date("2024-04-15")
      },
      {
        id: "2",
        employeeId: "2",
        startDate: new Date("2024-04-10"),
        endDate: new Date("2024-04-12"),
        daysUsed: 3,
        reason: "Personal matters",
        status: "Approved",
        createdAt: new Date("2024-04-01")
      },
      {
        id: "3",
        employeeId: "3",
        startDate: new Date("2024-06-20"),
        endDate: new Date("2024-06-25"),
        daysUsed: 6,
        reason: "Summer break",
        status: "Pending",
        createdAt: new Date("2024-05-30")
      }
    ];
    localStorage.setItem(LEAVE_RECORDS_KEY, JSON.stringify(sampleLeaveRecords));
  }
};

// Get all leave records
export const getAllLeaveRecords = (): LeaveRecord[] => {
  initializeLeaveRecords();
  const leaveRecords = localStorage.getItem(LEAVE_RECORDS_KEY);
  return leaveRecords ? JSON.parse(leaveRecords).map((record: any) => ({
    ...record,
    startDate: new Date(record.startDate),
    endDate: new Date(record.endDate),
    createdAt: new Date(record.createdAt)
  })) : [];
};

// Get leave records for a specific employee
export const getEmployeeLeaveRecords = (employeeId: string): LeaveRecord[] => {
  const allRecords = getAllLeaveRecords();
  return allRecords.filter(record => record.employeeId === employeeId);
};

// Calculate leave balance for each employee
export const calculateEmployeeLeaveBalances = (): EmployeeLeaveBalance[] => {
  const employees = getAllEmployees();
  const allLeaveRecords = getAllLeaveRecords();
  
  return employees.map(employee => {
    const employeeLeaves = allLeaveRecords.filter(
      record => record.employeeId === employee.id && record.status === "Approved"
    );
    
    const usedDays = employeeLeaves.reduce((total, record) => total + record.daysUsed, 0);
    const remainingDays = TOTAL_ANNUAL_LEAVE_DAYS - usedDays;
    
    return {
      employeeId: employee.id,
      employeeName: employee.name,
      totalDays: TOTAL_ANNUAL_LEAVE_DAYS,
      usedDays,
      remainingDays
    };
  });
};

// Add new leave record
export const addLeaveRecord = (leaveRecord: Omit<LeaveRecord, "id" | "createdAt">): LeaveRecord => {
  const leaveRecords = getAllLeaveRecords();
  
  const newRecord: LeaveRecord = {
    ...leaveRecord,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  
  localStorage.setItem(LEAVE_RECORDS_KEY, JSON.stringify([...leaveRecords, newRecord]));
  return newRecord;
};

// Update leave record
export const updateLeaveRecord = (leaveRecord: LeaveRecord): LeaveRecord | null => {
  const leaveRecords = getAllLeaveRecords();
  const index = leaveRecords.findIndex(record => record.id === leaveRecord.id);
  
  if (index === -1) return null;
  
  leaveRecords[index] = leaveRecord;
  localStorage.setItem(LEAVE_RECORDS_KEY, JSON.stringify(leaveRecords));
  return leaveRecord;
};

// Delete leave record
export const deleteLeaveRecord = (id: string): boolean => {
  const leaveRecords = getAllLeaveRecords();
  const filteredRecords = leaveRecords.filter(record => record.id !== id);
  
  if (filteredRecords.length === leaveRecords.length) return false;
  
  localStorage.setItem(LEAVE_RECORDS_KEY, JSON.stringify(filteredRecords));
  return true;
};
