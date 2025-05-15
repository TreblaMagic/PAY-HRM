
import { Button } from "@/components/ui/button";
import { EmployeeDialog } from "@/components/employees/EmployeeDialog";
import { DeleteConfirmationDialog } from "@/components/employees/DeleteConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { EmployeeTable } from "./EmployeeTable";
import { useEmployees } from "@/hooks/useEmployees";

export function RecentEmployees() {
  const {
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
  } = useEmployees();
  
  const navigate = useNavigate();

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
      
      <EmployeeTable 
        employees={employees}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
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
