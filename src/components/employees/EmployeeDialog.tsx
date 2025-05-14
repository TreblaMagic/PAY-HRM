
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from "@/types/employee";
import { EmployeeForm } from "./EmployeeForm";

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee;
  onSubmit: (data: Omit<Employee, "id">) => void;
  title: string;
}

export function EmployeeDialog({
  isOpen,
  onClose,
  employee,
  onSubmit,
  title,
}: EmployeeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <EmployeeForm 
          initialData={employee}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
