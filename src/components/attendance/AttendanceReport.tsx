import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { DateRange } from "@/types/attendance";
import { DateRangePicker } from "@/components/attendance/DateRangePicker";

interface AttendanceReportProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onGenerateReport: () => void;
}

export function AttendanceReport({
  dateRange,
  onDateRangeChange,
  onGenerateReport
}: AttendanceReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Print Attendance Report</CardTitle>
        <CardDescription>Generate a PDF report of attendance for a specific date range</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <DateRangePicker 
              dateRange={dateRange} 
              setDateRange={onDateRangeChange} 
              onPrint={onGenerateReport} 
            />
          </div>
          <Button onClick={onGenerateReport} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
