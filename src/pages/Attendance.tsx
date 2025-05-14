
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Printer, Search } from "lucide-react";
import { DateRangePicker } from "@/components/attendance/DateRangePicker";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Employee } from "@/types/employee";
import { AttendanceRecord, AttendanceStatus, DateRange } from "@/types/attendance";
import { getAllEmployees } from "@/services/employeeService";
import { 
  addAttendance, 
  deleteAttendance, 
  getAttendanceByDateRange, 
  getAttendanceByEmployeeId, 
  getAllAttendance 
} from "@/services/attendanceService";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Add type declaration for jsPDF with autotable plugin
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>("On Time");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

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
    }
  };

  const loadAttendanceRecords = async () => {
    try {
      const records = await getAllAttendance();
      setAttendanceRecords(records);
    } catch (error) {
      console.error("Error loading attendance records:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployeeId || !attendanceDate) return;

    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!selectedEmployee) return;

    try {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        employeeId: selectedEmployeeId,
        employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        date: attendanceDate,
        status: attendanceStatus,
      };

      await addAttendance(newRecord);
      setAttendanceRecords([...attendanceRecords, newRecord]);
      
      // Reset form
      setSelectedEmployeeId("");
      setAttendanceDate(new Date());
      setAttendanceStatus("On Time");
    } catch (error) {
      console.error("Error adding attendance record:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAttendance(id);
      setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
    } catch (error) {
      console.error("Error deleting attendance record:", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select a date range for the report");
      return;
    }

    try {
      const records = await getAttendanceByDateRange(dateRange.startDate, dateRange.endDate);
      
      if (records.length === 0) {
        alert("No attendance records found for the selected date range");
        return;
      }

      generatePDF(records, dateRange);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const generatePDF = (records: AttendanceRecord[], dateRange: DateRange) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Attendance Report", 14, 22);
    
    // Add date range
    doc.setFontSize(12);
    doc.text(
      `Date Range: ${format(dateRange.startDate!, "PPP")} to ${format(dateRange.endDate!, "PPP")}`,
      14, 
      32
    );
    
    // Group records by employee
    const employeeMap = new Map<string, AttendanceRecord[]>();
    
    records.forEach(record => {
      if (!employeeMap.has(record.employeeId)) {
        employeeMap.set(record.employeeId, []);
      }
      employeeMap.get(record.employeeId)!.push(record);
    });
    
    // Prepare data for the table
    const tableData: any[] = [];
    
    employeeMap.forEach((empRecords, employeeId) => {
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee) return;
      
      const employeeName = `${employee.firstName} ${employee.lastName}`;
      
      const onTimeCount = empRecords.filter(r => r.status === "On Time").length;
      const lateCount = empRecords.filter(r => r.status === "Late").length;
      const veryLateCount = empRecords.filter(r => r.status === "Very Late").length;
      const totalDays = empRecords.length;
      
      tableData.push([
        employeeName,
        onTimeCount,
        lateCount,
        veryLateCount,
        totalDays,
        `${Math.round((onTimeCount / totalDays) * 100)}%`
      ]);
    });
    
    // Generate table
    doc.autoTable({
      startY: 40,
      head: [['Employee Name', 'On Time', 'Late', 'Very Late', 'Total Days', 'Punctuality']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Add page numbers
    const pageCount = doc.internal.pages.length;
    for (let i = 1; i <= pageCount - 1; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount - 1}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    doc.save(`Attendance_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return record.employeeName.toLowerCase().includes(lowerSearchTerm);
  });

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      case "Very Late":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout title="Attendance Management" activePage="attendance">
      <div className="p-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Attendance Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Record Attendance</CardTitle>
              <CardDescription>Select an employee and mark attendance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee</label>
                  <Select
                    value={selectedEmployeeId}
                    onValueChange={setSelectedEmployeeId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {attendanceDate ? format(attendanceDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={attendanceDate}
                        onSelect={setAttendanceDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={attendanceStatus}
                    onValueChange={(value) => setAttendanceStatus(value as AttendanceStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On Time">On Time</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                      <SelectItem value="Very Late">Very Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleSubmit} className="w-full">
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Records Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>View and manage attendance records</CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employee..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>{record.employeeName}</TableCell>
                        <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                        <TableCell>
                          <Badge className={cn("font-medium", getStatusColor(record.status))}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Print Report Card */}
          <Card>
            <CardHeader>
              <CardTitle>Print Attendance Report</CardTitle>
              <CardDescription>Generate a PDF report of attendance for a specific date range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
                </div>
                <Button onClick={handleGenerateReport} className="flex items-center">
                  <Printer className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
