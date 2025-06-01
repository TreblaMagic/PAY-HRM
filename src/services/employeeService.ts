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

  return data || [];
};

// Add employee
export const addEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert([employee])
    .select()
    .single();

  if (error) {
    console.error('Error adding employee:', error);
    throw error;
  }

  return data;
};

// Update employee
export const updateEmployee = async (employee: Employee): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('employees')
    .update(employee)
    .eq('id', employee.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating employee:', error);
    throw error;
  }

  return data;
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
    .order('hireDate', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent employees:', error);
    throw error;
  }

  return data || [];
};
