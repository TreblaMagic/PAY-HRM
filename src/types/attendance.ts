
export type AttendanceStatus = 'On Time' | 'Late' | 'Very Late';

export type Attendance = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: AttendanceStatus;
};

export type DateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};
