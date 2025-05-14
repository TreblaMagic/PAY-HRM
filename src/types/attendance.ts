
export type AttendanceStatus = "On Time" | "Late" | "Very Late";

export type DateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  status: AttendanceStatus;
};
