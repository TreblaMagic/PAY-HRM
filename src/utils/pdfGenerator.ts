
import jsPDF from "jspdf";
import { format } from "date-fns";
import { AttendanceRecord, DateRange } from "@/types/attendance";
import { Employee } from "@/types/employee";

// Add type declaration for jsPDF with autotable plugin
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function generateAttendancePDF(
  records: AttendanceRecord[], 
  dateRange: DateRange,
  employees: Employee[]
) {
  if (!dateRange.startDate || !dateRange.endDate || records.length === 0) {
    return null;
  }
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text("Attendance Report", 14, 22);
  
  // Add date range
  doc.setFontSize(12);
  doc.text(
    `Date Range: ${format(dateRange.startDate, "PPP")} to ${format(dateRange.endDate, "PPP")}`,
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
    
    const employeeName = employee.name;
    
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
  
  return doc;
}
