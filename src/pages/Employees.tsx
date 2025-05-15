
import React, { useState } from "react";
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
import { EmployeesSidebar } from "@/components/employees/EmployeesSidebar";
import { EmployeesHeader } from "@/components/employees/EmployeesHeader";
import { EmployeesBreadcrumbs } from "@/components/employees/EmployeesBreadcrumbs";
import { EmployeesActions } from "@/components/employees/EmployeesActions";
import { EmployeesTable } from "@/components/employees/EmployeesTable";

export default function Employees() {
  const { user, loading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(getAllEmployees());
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

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

  const handleAddEmployee = (data: Omit<Employee, "id">) => {
    const newEmployee = addEmployee(data);
    setEmployees(getAllEmployees());
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Employee added successfully",
    });
  };

  const handleEditEmployee = (data: Omit<Employee, "id">) => {
    if (!selectedEmployee) return;
    
    const updated = updateEmployee({
      ...data,
      id: selectedEmployee.id,
    });
    
    if (updated) {
      setEmployees(getAllEmployees());
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
      setEmployees(getAllEmployees());
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <EmployeesSidebar />
      
      <div className="flex-1 overflow-auto">
        <EmployeesHeader 
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
        />
        
        <EmployeesBreadcrumbs />
        
        <div className="p-6">
          <EmployeesActions 
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onAddEmployee={() => setIsAddDialogOpen(true)}
          />

          <EmployeesTable 
            employees={filteredEmployees}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />

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
      </div>
    </div>
  );
}
