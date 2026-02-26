import { Employee } from "../types/employee";
import { supabase } from "@/lib/supabase";

// Get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }

  // Convert snake_case to camelCase for TypeScript
  return (data || []).map(emp => ({
    id: emp.id,
    name: emp.name,
    position: emp.position,
    department: emp.department,
    email: emp.email,
    phone: emp.phone || '',
    hireDate: emp.hire_date,
    salary: emp.salary,
    leaveDaysAllocated: emp.leave_days_allocated
  }));
};

// Add employee
export const addEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
  // Convert camelCase to snake_case for database
  const dbEmployee = {
    name: employee.name,
    position: employee.position,
    department: employee.department,
    email: employee.email,
    phone: employee.phone || null,
    hire_date: employee.hireDate,
    salary: employee.salary,
    leave_days_allocated: employee.leaveDaysAllocated ?? 15
  };

  const { data, error } = await supabase
    .from('employees')
    .insert([dbEmployee])
    .select()
    .single();

  if (error) {
    console.error('Error adding employee:', error);
    throw error;
  }

  // Convert snake_case back to camelCase for TypeScript
  return {
    id: data.id,
    name: data.name,
    position: data.position,
    department: data.department,
    email: data.email,
    phone: data.phone || '',
    hireDate: data.hire_date,
    salary: data.salary,
    leaveDaysAllocated: data.leave_days_allocated
  };
};

// Update employee
export const updateEmployee = async (employee: Employee): Promise<Employee | null> => {
  // Convert camelCase to snake_case for database
  const dbEmployee = {
    name: employee.name,
    position: employee.position,
    department: employee.department,
    email: employee.email,
    phone: employee.phone || null,
    hire_date: employee.hireDate,
    salary: employee.salary,
    leave_days_allocated: employee.leaveDaysAllocated ?? 15
  };

  const { data, error } = await supabase
    .from('employees')
    .update(dbEmployee)
    .eq('id', employee.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating employee:', error);
    throw error;
  }

  // Convert snake_case back to camelCase for TypeScript
  return {
    id: data.id,
    name: data.name,
    position: data.position,
    department: data.department,
    email: data.email,
    phone: data.phone || '',
    hireDate: data.hire_date,
    salary: data.salary,
    leaveDaysAllocated: data.leave_days_allocated
  };
};

// Delete employee
export const deleteEmployee = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }

  return true;
};

// Get recent employees (for dashboard)
export const getRecentEmployees = async (limit: number = 5): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('hire_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent employees:', error);
    throw error;
  }

  // Convert snake_case to camelCase for TypeScript
  return (data || []).map(emp => ({
    id: emp.id,
    name: emp.name,
    position: emp.position,
    department: emp.department,
    email: emp.email,
    phone: emp.phone || '',
    hireDate: emp.hire_date,
    salary: emp.salary,
    leaveDaysAllocated: emp.leave_days_allocated
  }));
};
