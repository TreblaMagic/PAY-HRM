import { useState, useEffect } from "react";
import { Employee } from "@/types/employee";
import { getRecentEmployees, updateEmployee, deleteEmployee } from "@/services/employeeService";
import { toast } from "@/hooks/use-toast";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getRecentEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Error",
          description: "Failed to fetch employees",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEditEmployee = async (data: Omit<Employee, "id">) => {
    if (!selectedEmployee) return;
    
    try {
      const updated = await updateEmployee({
        ...data,
        id: selectedEmployee.id,
      });
      
      if (updated) {
        const freshData = await getRecentEmployees();
        setEmployees(freshData);
        setIsEditDialogOpen(false);
        setSelectedEmployee(undefined);
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      const deleted = await deleteEmployee(selectedEmployee.id);
      
      if (deleted) {
        const freshData = await getRecentEmployees();
        setEmployees(freshData);
        setIsDeleteDialogOpen(false);
        setSelectedEmployee(undefined);
        toast({
          title: "Success",
          description: "Employee deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
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
    isLoading,
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
