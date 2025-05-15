
import { useState } from "react";
import { Employee } from "@/types/employee";
import { getRecentEmployees, updateEmployee, deleteEmployee } from "@/services/employeeService";
import { toast } from "@/hooks/use-toast";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(getRecentEmployees());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

  const handleEditEmployee = (data: Omit<Employee, "id">) => {
    if (!selectedEmployee) return;
    
    const updated = updateEmployee({
      ...data,
      id: selectedEmployee.id,
    });
    
    if (updated) {
      setEmployees(getRecentEmployees());
      setIsEditDialogOpen(false);
      setSelectedEmployee(undefined);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    }
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;
    
    const deleted = deleteEmployee(selectedEmployee.id);
    
    if (deleted) {
      setEmployees(getRecentEmployees());
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(undefined);
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    }
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  return {
    employees,
    selectedEmployee,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleEditEmployee,
    handleDeleteEmployee,
    openEditDialog,
    openDeleteDialog,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setSelectedEmployee
  };
}
