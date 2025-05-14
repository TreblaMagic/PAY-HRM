
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { Employee } from "@/types/employee";
import { getRecentEmployees, updateEmployee, deleteEmployee } from "@/services/employeeService";
import { EmployeeDialog } from "@/components/employees/EmployeeDialog";
import { DeleteConfirmationDialog } from "@/components/employees/DeleteConfirmationDialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function RecentEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(getRecentEmployees());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);
  const navigate = useNavigate();

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

  const viewAllEmployees = () => {
    navigate("/employees");
  };

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Recent Employees</h2>
        <Button variant="outline" size="sm" onClick={viewAllEmployees}>
          View All
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={viewAllEmployees}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(employee)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(employee)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
