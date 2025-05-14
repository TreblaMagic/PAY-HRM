
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  CalendarIcon, 
  Printer,
  Search
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Employee } from "@/types/employee";
import { AttendanceRecord, AttendanceStatus, DateRange } from "@/types/attendance";
import { getAllEmployees } from "@/services/employeeService";
import { 
  addAttendance, 
  getAllAttendance, 
  getAttendanceByDate, 
  getAttendanceByDateRange 
} from "@/services/attendanceService";
import { DateRangePicker } from "@/components/attendance/DateRangePicker";
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

  const navigate = useNavigate();

  useEffect(() => {
    setEmployees(getAllEmployees());
    setAttendanceRecords(getAllAttendance());
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAttendance = attendanceRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedEmployeeId || !attendanceDate) {
      toast({
        title: "Error",
        description: "Please select both employee and date",
        variant: "destructive",
      });
      return;
    }

    try {
      const formattedDate = format(attendanceDate, "yyyy-MM-dd");
      const newAttendance = addAttendance(
        selectedEmployeeId,
        formattedDate,
        attendanceStatus
      );
      
      // Refresh attendance list
      setAttendanceRecords(getAllAttendance());
      
      toast({
        title: "Success",
        description: "Attendance recorded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record attendance",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      case "Very Late":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handlePrintReport = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    const filteredRecords = getAttendanceByDateRange(dateRange);
    
    if (filteredRecords.length === 0) {
      toast({
        title: "No data",
        description: "No attendance records found for the selected date range",
      });
      return;
    }

    generatePDF(filteredRecords, dateRange);
  };

  const generatePDF = (records: Attendance[], range: DateRange) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Attendance Report", 14, 22);
    
    // Add date range
    doc.setFontSize(12);
    doc.text(
      `Period: ${format(range.startDate as Date, "MMM dd, yyyy")} - ${format(
        range.endDate as Date,
        "MMM dd, yyyy"
      )}`,
      14,
      32
    );
    
    // Create table data
    const tableData = records.map((record) => [
      record.employeeName,
      formatDate(record.date),
      record.status,
    ]);
    
    // Generate table
    doc.autoTable({
      startY: 40,
      head: [["Employee", "Date", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [155, 135, 245], // Primary purple color
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30, halign: "center" },
      },
      didDrawCell: function(data) {
        // Color status cells based on value
        if (data.column.index === 2 && data.cell.section === 'body') {
          const status = data.cell.raw as string;
          const cell = data.cell;
          
          if (status === "On Time") {
            doc.setFillColor(240, 255, 240); // light green
            doc.rect(cell.x, cell.y, cell.width, cell.height, 'F');
            doc.setTextColor(0, 100, 0); // dark green
          } else if (status === "Late") {
            doc.setFillColor(255, 255, 224); // light yellow
            doc.rect(cell.x, cell.y, cell.width, cell.height, 'F');
            doc.setTextColor(184, 134, 11); // dark yellow
          } else if (status === "Very Late") {
            doc.setFillColor(255, 235, 235); // light red
            doc.rect(cell.x, cell.y, cell.width, cell.height, 'F');
            doc.setTextColor(178, 34, 34); // dark red
          }
          
          // Re-add text after changing background
          doc.text(status, cell.x + cell.width / 2, cell.y + cell.height / 2, {
            align: "center",
            baseline: "middle"
          });
          
          return false; // Return false to prevent auto-rendering of cell content
        }
      }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount} - Generated on ${format(new Date(), "MMM dd, yyyy")}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }
    
    // Save PDF
    doc.save(`Attendance_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    
    toast({
      title: "Success",
      description: "Attendance report generated successfully",
    });
  };

  return (
    <DashboardLayout title="Attendance" activePage="attendance">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">
            Track and manage employee attendance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Attendance Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Record Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Employee</label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !attendanceDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {attendanceDate ? (
                        format(attendanceDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={attendanceDate}
                      onSelect={setAttendanceDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={attendanceStatus}
                  onValueChange={(value) => setAttendanceStatus(value as AttendanceStatus)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On Time">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        On Time
                      </div>
                    </SelectItem>
                    <SelectItem value="Late">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        Late
                      </div>
                    </SelectItem>
                    <SelectItem value="Very Late">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        Very Late
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full" 
                onClick={handleSubmit}
                disabled={!selectedEmployeeId || !attendanceDate}
              >
                Submit Attendance
              </Button>
            </CardContent>
          </Card>

          {/* Attendance Report Section */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a date range to generate an attendance report
              </p>
              
              <DateRangePicker 
                dateRange={dateRange}
                setDateRange={setDateRange}
                onPrint={handlePrintReport}
              />
              
              <div className="flex items-center mt-4">
                <div className="flex items-center mr-4">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs">On Time</span>
                </div>
                <div className="flex items-center mr-4">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-xs">Late</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs">Very Late</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance List */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Attendance Records</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="rounded-lg border shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>
                        <span
                          className={`${getStatusColor(
                            record.status
                          )} px-2 py-1 rounded-full text-xs font-medium`}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
