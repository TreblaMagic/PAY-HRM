
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { AttendanceRecord, AttendanceStatus } from "@/types/attendance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onDelete: (id: string) => void;
}

export function AttendanceTable({
  records,
  searchTerm,
  setSearchTerm,
  onDelete
}: AttendanceTableProps) {
  const filteredRecords = records.filter(record => {
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
                      onClick={() => onDelete(record.id)}
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
  );
}
