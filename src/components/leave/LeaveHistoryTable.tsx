import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2 } from "lucide-react";
import { LeaveRecord } from "@/types/leave";
import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";

interface LeaveHistoryTableProps {
  leaveRecords: LeaveRecord[];
  employees: Employee[];
  onDeleteLeave: (leaveId: string) => void;
}

export function LeaveHistoryTable({ leaveRecords, employees, onDeleteLeave }: LeaveHistoryTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : "Unknown";
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-lg border shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Leave Period</TableHead>
            <TableHead className="hidden md:table-cell">Days Used</TableHead>
            <TableHead className="hidden md:table-cell">Reason</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Date Requested</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No leave records found
              </TableCell>
            </TableRow>
          ) :
            leaveRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="font-medium">{getEmployeeName(record.employeeId)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(record.startDate)} - {formatDate(record.endDate)}</span>
                  </div>
                  <div className="md:hidden text-sm text-muted-foreground mt-1">
                    {record.daysUsed} days • {record.status}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="font-medium">{record.daysUsed}</span> days
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {record.reason}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className={getStatusBadgeColor(record.status)} variant="outline">
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(record.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onDeleteLeave(record.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}
