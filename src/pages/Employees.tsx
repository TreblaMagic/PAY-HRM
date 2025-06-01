import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Employee } from "@/types/employee";
import { 
  addEmployee, 
  deleteEmployee, 
  getAllEmployees, 
  updateEmployee 
} from "@/services/employeeService";
import { EmployeeDialog } from "@/components/employees/EmployeeDialog";
import { DeleteConfirmationDialog } from "@/components/employees/DeleteConfirmationDialog";
import { EmployeesActions } from "@/components/employees/EmployeesActions";
import { EmployeesTable } from "@/components/employees/EmployeesTable";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Employees() {
  const { user, loading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = async (data: Omit<Employee, "id">) => {
    try {
      await addEmployee(data);
      await loadEmployees();
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = async (data: Omit<Employee, "id">) => {
    if (!selectedEmployee) return;
    
    try {
      await updateEmployee({
        ...data,
        id: selectedEmployee.id,
      });
      await loadEmployees();
      setIsEditDialogOpen(false);
      setSelectedEmployee(undefined);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
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
      await deleteEmployee(selectedEmployee.id);
      await loadEmployees();
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(undefined);
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
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

  return (
    <DashboardLayout title="Employees" activePage="employees">
      <div className="p-6">
        <EmployeesActions 
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onAddEmployee={() => setIsAddDialogOpen(true)}
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <EmployeesTable 
            employees={filteredEmployees}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        )}

        <EmployeeDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddEmployee}
          title="Add New Employee"
        />

        <EmployeeDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedEmployee(undefined);
          }}
          employee={selectedEmployee}
          onSubmit={handleEditEmployee}
          title="Edit Employee"
        />

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedEmployee(undefined);
          }}
          onConfirm={handleDeleteEmployee}
        />
      </div>
    </DashboardLayout>
  );
}
