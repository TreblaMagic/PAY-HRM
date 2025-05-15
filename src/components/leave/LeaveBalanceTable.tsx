
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeLeaveBalance } from "@/types/leave";

interface LeaveBalanceTableProps {
  leaveBalances: EmployeeLeaveBalance[];
  onUpdateLeave: (employeeId: string) => void;
}

export function LeaveBalanceTable({ leaveBalances, onUpdateLeave }: LeaveBalanceTableProps) {
  return (
    <div className="rounded-lg border shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead className="hidden md:table-cell">Total Days</TableHead>
            <TableHead className="hidden md:table-cell">Used Days</TableHead>
            <TableHead className="hidden md:table-cell">Remaining Days</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveBalances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            leaveBalances.map((balance) => (
              <TableRow key={balance.employeeId}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{balance.employeeName}</div>
                      <div className="text-sm text-muted-foreground md:hidden">
                        Used: {balance.usedDays} / {balance.totalDays} days
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{balance.totalDays}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={balance.usedDays > 0 ? "text-amber-600 font-medium" : ""}>
                    {balance.usedDays}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={balance.remainingDays < 10 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                    {balance.remainingDays}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onUpdateLeave(balance.employeeId)}
                  >
                    Update Leave
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
