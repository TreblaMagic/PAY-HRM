
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { Employee } from "@/types/employee";

interface EmployeeActionsProps {
  employee: Employee;
  onView: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeActions({ employee, onView, onEdit, onDelete }: EmployeeActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="icon" onClick={onView}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onDelete(employee)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
