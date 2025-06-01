import React, { useState } from "react";
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
  onUpdateLeaveDays: (employeeId: string, newTotalDays: number) => void;
}

export function LeaveBalanceTable({ leaveBalances, onUpdateLeave, onUpdateLeaveDays }: LeaveBalanceTableProps) {
  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<string | null>(null);

  const handleEdit = (employeeId: string, value: number) => {
    setEditValues((prev) => ({ ...prev, [employeeId]: value }));
    setEditing(employeeId);
  };

  const handleSave = (employeeId: string) => {
    if (editValues[employeeId] && editValues[employeeId] > 0) {
      onUpdateLeaveDays(employeeId, editValues[employeeId]);
      setEditing(null);
    }
  };

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
                <TableCell className="hidden md:table-cell">
                  {editing === balance.employeeId ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={editValues[balance.employeeId] ?? balance.totalDays}
                        onChange={e => handleEdit(balance.employeeId, Number(e.target.value))}
                        className="w-20 border rounded px-2 py-1"
                      />
                      <Button size="sm" onClick={() => handleSave(balance.employeeId)}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{balance.totalDays}</span>
                      <Button size="sm" variant="outline" onClick={() => setEditing(balance.employeeId)}>
                        Edit
                      </Button>
                    </div>
                  )}
                </TableCell>
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
