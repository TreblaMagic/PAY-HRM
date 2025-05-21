import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";
import { AttendanceRecord, DateRange } from "@/types/attendance";
import { Employee } from "@/types/employee";

// Add type declaration for jsPDF with autotable plugin
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Helper function to calculate punctuality score
function calculatePunctualityScore(records: AttendanceRecord[]): number {
  const points = {
    "On Time": 3,
    "Late": 1,
    "Very Late": 0
  };

  const totalPoints = records.reduce((sum, record) => sum + points[record.status], 0);
  const maxPossiblePoints = records.length * 3;
  
  return (totalPoints / maxPossiblePoints) * 100;
}

// Helper function to get score interpretation
function getScoreInterpretation(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Improvement";
  return "Poor";
}

export function generateAttendancePDF(
  records: AttendanceRecord[], 
  dateRange: DateRange,
  employees: Employee[]
) {
  if (!dateRange.startDate || !dateRange.endDate || records.length === 0) {
    return null;
  }
  
  // Create new jsPDF instance with proper initialization
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
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
    
    const punctualityScore = calculatePunctualityScore(empRecords);
    const interpretation = getScoreInterpretation(punctualityScore);
    
    tableData.push([
      employeeName,
      onTimeCount,
      lateCount,
      veryLateCount,
      totalDays,
      `${punctualityScore.toFixed(1)}% (${interpretation})`
    ]);
  });
  
  // Generate table using autoTable directly
  autoTable(doc, {
    startY: 40,
    head: [['Employee Name', 'On Time', 'Late', 'Very Late', 'Total Days', 'Punctuality Score']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  // Add interpretation guide at the bottom
  const lastAutoTable = (doc as any).lastAutoTable;
  const finalY = lastAutoTable.finalY || 40;
  
  doc.setFontSize(10);
  doc.text("Interpreting the Score:", 14, finalY + 10);
  doc.text("90–100% = Excellent", 14, finalY + 15);
  doc.text("70–89% = Good", 14, finalY + 20);
  doc.text("50–69% = Needs Improvement", 14, finalY + 25);
  doc.text("Below 50% = Poor", 14, finalY + 30);
  
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
