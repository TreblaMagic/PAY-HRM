
import React, { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AttendanceRecord, AttendanceStatus } from "@/types/attendance";
import { Employee } from "@/types/employee";
import { toast } from "@/components/ui/use-toast";

interface RecordAttendanceProps {
  employees: Employee[];
  onAddAttendance: (record: AttendanceRecord) => void;
}

export function RecordAttendance({ employees, onAddAttendance }: RecordAttendanceProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>("On Time");

  const handleSubmit = () => {
    if (!selectedEmployeeId || !attendanceDate) {
      toast({
        title: "Missing information",
        description: "Please select an employee and date",
        variant: "destructive"
      });
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!selectedEmployee) return;

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      employeeId: selectedEmployeeId,
      employeeName: selectedEmployee.name,
      date: attendanceDate,
      status: attendanceStatus,
    };

    onAddAttendance(newRecord);
    
    // Reset form
    setSelectedEmployeeId("");
    setAttendanceDate(new Date());
    setAttendanceStatus("On Time");
    
    toast({
      title: "Attendance recorded",
      description: `Attendance for ${selectedEmployee.name} has been recorded successfully.`
    });
  };

  return (
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
                    {employee.name}
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
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !attendanceDate && "text-muted-foreground"
                  )}
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
                  className={cn("p-3 pointer-events-auto")}
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
  );
}
