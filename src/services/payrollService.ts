import { Employee } from "@/types/employee";
import { Bonus, PaymentStatus } from "@/types/payroll";
import { getAllEmployees } from "./employeeService";

// Storage keys
const PAYMENT_STATUS_KEY = "payment_status";
const BONUSES_KEY = "employee_bonuses";

// Initialize data in localStorage if empty
const initializePayrollData = (): void => {
  if (!localStorage.getItem(PAYMENT_STATUS_KEY)) {
    const employees = getAllEmployees();
    const initialPaymentStatus: PaymentStatus[] = employees.map(employee => ({
      employeeId: employee.id,
      year: new Date().getFullYear(),
      months: {
        January: false,
        February: false,
        March: false,
        April: false,
        May: false,
        June: false,
        July: false,
        August: false,
        September: false,
        October: false,
        November: false,
        December: false
      }
    }));
    
    localStorage.setItem(PAYMENT_STATUS_KEY, JSON.stringify(initialPaymentStatus));
  }
  
  if (!localStorage.getItem(BONUSES_KEY)) {
    localStorage.setItem(BONUSES_KEY, JSON.stringify([]));
  }
};

// Get payment status for all employees
export const getAllPaymentStatus = (): PaymentStatus[] => {
  initializePayrollData();
  const paymentStatus = localStorage.getItem(PAYMENT_STATUS_KEY);
  return paymentStatus ? JSON.parse(paymentStatus) : [];
};

// Initialize payment status for an employee if it doesn't exist
const initializeEmployeePaymentStatus = (employeeId: string): PaymentStatus => {
  const allStatus = getAllPaymentStatus();
  const existingStatus = allStatus.find(status => status.employeeId === employeeId);
  
  if (existingStatus) return existingStatus;
  
  const newStatus: PaymentStatus = {
    employeeId,
    year: new Date().getFullYear(),
    months: {
      January: false,
      February: false,
      March: false,
      April: false,
      May: false,
      June: false,
      July: false,
      August: false,
      September: false,
      October: false,
      November: false,
      December: false
    }
  };
  
  allStatus.push(newStatus);
  localStorage.setItem(PAYMENT_STATUS_KEY, JSON.stringify(allStatus));
  return newStatus;
};

// Get payment status for a specific employee
export const getEmployeePaymentStatus = (employeeId: string): PaymentStatus | undefined => {
  const allStatus = getAllPaymentStatus();
  const status = allStatus.find(status => status.employeeId === employeeId);
  
  if (!status) {
    // Initialize payment status if it doesn't exist
    return initializeEmployeePaymentStatus(employeeId);
  }
  
  return status;
};

// Update payment status for an employee
export const updatePaymentStatus = (
  employeeId: string, 
  month: string, 
  isPaid: boolean
): PaymentStatus | null => {
  const allStatus = getAllPaymentStatus();
  const index = allStatus.findIndex(status => status.employeeId === employeeId);
  
  if (index === -1) return null;
  
  allStatus[index].months[month] = isPaid;
  localStorage.setItem(PAYMENT_STATUS_KEY, JSON.stringify(allStatus));
  return allStatus[index];
};

// Update multiple months payment status for an employee
export const updateMultiplePaymentStatus = (
  employeeId: string,
  months: Record<string, boolean>
): PaymentStatus | null => {
  try {
    const allStatus = getAllPaymentStatus();
    const index = allStatus.findIndex(status => status.employeeId === employeeId);
    
    if (index === -1) {
      // Initialize payment status if it doesn't exist
      const newStatus = initializeEmployeePaymentStatus(employeeId);
      newStatus.months = { ...newStatus.months, ...months };
      return newStatus;
    }
    
    allStatus[index].months = { ...allStatus[index].months, ...months };
    localStorage.setItem(PAYMENT_STATUS_KEY, JSON.stringify(allStatus));
    return allStatus[index];
  } catch (error) {
    console.error('Failed to update payment status:', error);
    return null;
  }
};

// Get all bonuses
export const getAllBonuses = (): Bonus[] => {
  initializePayrollData();
  const bonuses = localStorage.getItem(BONUSES_KEY);
  return bonuses ? JSON.parse(bonuses) : [];
};

// Get bonuses for a specific employee
export const getEmployeeBonuses = (employeeId: string): Bonus[] => {
  const allBonuses = getAllBonuses();
  return allBonuses.filter(bonus => bonus.employeeId === employeeId);
};

// Add a new bonus
export const addBonus = (bonus: Omit<Bonus, "id">): Bonus => {
  const allBonuses = getAllBonuses();
  const newBonus = {
    ...bonus,
    id: Date.now().toString()
  };
  
  localStorage.setItem(BONUSES_KEY, JSON.stringify([...allBonuses, newBonus]));
  return newBonus;
};

// Calculate total bonuses for an employee
export const calculateTotalBonuses = (employeeId: string): number => {
  const bonuses = getEmployeeBonuses(employeeId);
  return bonuses.reduce((total, bonus) => total + bonus.amount, 0);
};

// Calculate annual salary (base salary * 12 + bonuses)
export const calculateAnnualSalary = (employee: Employee): number => {
  const baseSalary = employee.salary * 12;
  const bonuses = calculateTotalBonuses(employee.id);
  return baseSalary + bonuses;
};

// Count paid months for an employee
export const countPaidMonths = (employeeId: string): number => {
  const status = getEmployeePaymentStatus(employeeId);
  if (!status) return 0;
  
  return Object.values(status.months).filter(isPaid => isPaid).length;
};

// Delete a bonus
export const deleteBonus = (bonusId: string): boolean => {
  const allBonuses = getAllBonuses();
  const filteredBonuses = allBonuses.filter(bonus => bonus.id !== bonusId);
  
  if (filteredBonuses.length === allBonuses.length) return false;
  
  localStorage.setItem(BONUSES_KEY, JSON.stringify(filteredBonuses));
  return true;
};
