
import { Employee } from "../types/employee";

// Simulate database with localStorage
const STORAGE_KEY = "employees";

// Initial sample data
const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    position: "Senior Developer",
    department: "Engineering",
    email: "john.smith@example.com",
    phone: "555-1234",
    hireDate: "2022-01-15",
    salary: 85000
  },
  {
    id: "2",
    name: "Sarah Johnson",
    position: "UX Designer",
    department: "Design",
    email: "sarah.johnson@example.com",
    phone: "555-5678",
    hireDate: "2021-11-03",
    salary: 72000
  },
  {
    id: "3",
    name: "Michael Chen",
    position: "Project Manager",
    department: "Product",
    email: "michael.chen@example.com",
    phone: "555-9012",
    hireDate: "2022-03-22",
    salary: 95000
  },
  {
    id: "4",
    name: "Emily Taylor",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "emily.taylor@example.com",
    phone: "555-3456",
    hireDate: "2021-08-10",
    salary: 65000
  },
  {
    id: "5",
    name: "David Wilson",
    position: "Frontend Developer",
    department: "Engineering",
    email: "david.wilson@example.com",
    phone: "555-7890",
    hireDate: "2022-02-14",
    salary: 78000
  }
];

// Initialize localStorage with sample data if empty
const initializeEmployees = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmployees));
  }
};

// Get all employees
export const getAllEmployees = (): Employee[] => {
  initializeEmployees();
  const employees = localStorage.getItem(STORAGE_KEY);
  return employees ? JSON.parse(employees) : [];
};

// Get recent employees (last 5)
export const getRecentEmployees = (): Employee[] => {
  const employees = getAllEmployees();
  return employees.slice(0, 5);
};

// Get employee by ID
export const getEmployeeById = (id: string): Employee | undefined => {
  const employees = getAllEmployees();
  return employees.find(employee => employee.id === id);
};

// Add employee
export const addEmployee = (employee: Omit<Employee, "id">): Employee => {
  const employees = getAllEmployees();
  const newEmployee = {
    ...employee,
    id: Date.now().toString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...employees, newEmployee]));
  return newEmployee;
};

// Update employee
export const updateEmployee = (employee: Employee): Employee | null => {
  const employees = getAllEmployees();
  const index = employees.findIndex(e => e.id === employee.id);
  
  if (index === -1) return null;
  
  employees[index] = employee;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  return employee;
};

// Delete employee
export const deleteEmployee = (id: string): boolean => {
  const employees = getAllEmployees();
  const filteredEmployees = employees.filter(employee => employee.id !== id);
  
  if (filteredEmployees.length === employees.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEmployees));
  return true;
};
