import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { RecordAttendance } from "@/components/attendance/RecordAttendance";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { AttendanceReport } from "@/components/attendance/AttendanceReport";
import { AttendanceRecord, DateRange } from "@/types/attendance";
import { Employee } from "@/types/employee";
import { getAllEmployees } from "@/services/employeeService";
import { 
  addAttendance, 
  deleteAttendance, 
  getAttendanceByDateRange, 
  getAllAttendance 
} from "@/services/attendanceService";
import { generateAttendancePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
    loadAttendanceRecords();
  }, []);

  const loadEmployees = async () => {
    try {
      const employees = await getAllEmployees();
      setEmployees(employees);
    } catch (error) {
      console.error("Error loading employees:", error);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive"
      });
    }
  };

  const loadAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      const records = await getAllAttendance();
      setAttendanceRecords(records);
    } catch (error) {
      console.error("Error loading attendance records:", error);
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttendance = async (record: Omit<AttendanceRecord, "id">) => {
    try {
      const newRecord = await addAttendance(record);
      setAttendanceRecords(prev => [...prev, newRecord]);
      toast({
        title: "Success",
        description: "Attendance record added successfully"
      });
    } catch (error) {
      console.error("Error adding attendance record:", error);
      toast({
        title: "Error",
        description: "Failed to add attendance record",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAttendance(id);
      setAttendanceRecords(prev => prev.filter(record => record.id !== id));
      toast({
        title: "Success",
        description: "Attendance record deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      toast({
        title: "Error",
        description: "Failed to delete attendance record",
        variant: "destructive"
      });
    }
  };

  const handleDateRangeChange = async (range: DateRange) => {
    setDateRange(range);
    if (range.startDate && range.endDate) {
      try {
        setIsLoading(true);
        const records = await getAttendanceByDateRange(range.startDate, range.endDate);
        setAttendanceRecords(records);
      } catch (error) {
        console.error("Error fetching attendance records by date range:", error);
        toast({
          title: "Error",
          description: "Failed to fetch attendance records",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      loadAttendanceRecords();
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleGenerateReport = async () => {
    try {
      const records = dateRange.startDate && dateRange.endDate
        ? await getAttendanceByDateRange(dateRange.startDate, dateRange.endDate)
        : attendanceRecords;

      await generateAttendancePDF(records, employees);
      toast({
        title: "Success",
        description: "Attendance report generated successfully"
      });
    } catch (error) {
      console.error("Error generating attendance report:", error);
      toast({
        title: "Error",
        description: "Failed to generate attendance report",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout title="Attendance Management" activePage="attendance">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Record and manage employee attendance</p>
        </div>

        <div className="space-y-6">
          <RecordAttendance 
            employees={employees}
            onAddAttendance={handleAddAttendance}
          />

          <AttendanceReport
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onSearch={handleSearch}
            onGenerateReport={handleGenerateReport}
          />

          <AttendanceTable
            records={attendanceRecords}
            employees={employees}
            searchTerm={searchTerm}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
