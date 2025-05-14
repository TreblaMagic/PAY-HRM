
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { User, Pencil, Trash2, Search, UserPlus } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(getAllEmployees());
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

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

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your company employees</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search employees..." 
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="rounded-lg border shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden md:table-cell">Position</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Hire Date</TableHead>
              <TableHead className="hidden md:table-cell">Salary</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {employee.position} • {employee.department}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                  <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                  <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(employee.hireDate)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatSalary(employee.salary)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(employee)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(employee)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
  );
}
