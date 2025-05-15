
export type LeaveRecord = {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  daysUsed: number;
  reason: string;
  status: LeaveStatus;
  createdAt: Date;
};

export type LeaveStatus = "Approved" | "Pending" | "Rejected";

export type EmployeeLeaveBalance = {
  employeeId: string;
  employeeName: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
};
