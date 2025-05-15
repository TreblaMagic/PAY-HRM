
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
      const records = await getAllAttendance();
      setAttendanceRecords(records);
    } catch (error) {
      console.error("Error loading attendance records:", error);
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive"
      });
    }
  };

  const handleAddAttendance = async (record: AttendanceRecord) => {
    try {
      await addAttendance(record);
      setAttendanceRecords(prev => [...prev, record]);
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
      setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
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

  const handleGenerateReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast({
        title: "Missing information",
        description: "Please select a date range for the report",
        variant: "destructive"
      });
      return;
    }

    try {
      const records = await getAttendanceByDateRange(dateRange.startDate, dateRange.endDate);
      
      if (records.length === 0) {
        toast({
          title: "No records found",
          description: "No attendance records found for the selected date range",
          variant: "destructive"
        });
        return;
      }

      const result = generateAttendancePDF(records, dateRange, employees);
      if (result) {
        toast({
          title: "Success",
          description: "Attendance report generated successfully"
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout title="Attendance Management" activePage="attendance">
      <div className="p-8">
        <div className="grid grid-cols-1 gap-6">
          <RecordAttendance 
            employees={employees} 
            onAddAttendance={handleAddAttendance} 
          />
          
          <AttendanceTable 
            records={attendanceRecords}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onDelete={handleDelete}
          />
          
          <AttendanceReport 
            dateRange={dateRange} 
            setDateRange={setDateRange}
            onGenerateReport={handleGenerateReport}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
