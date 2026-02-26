import { Employee } from "@/types/employee";
import { Bonus, PaymentStatus } from "@/types/payroll";
import { supabase } from "@/lib/supabase";

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
export const getAllPaymentStatus = async (): Promise<PaymentStatus[]> => {
  const { data, error } = await supabase
    .from('payment_status')
    .select('*');

  if (error) {
    console.error('Error fetching payment status:', error);
    throw error;
  }

  return data || [];
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
export const getEmployeePaymentStatus = async (employeeId: string): Promise<PaymentStatus | null> => {
  try {
    console.log('Fetching payment status for employee:', employeeId);
    
    const { data, error } = await supabase
      .from('payment_status')
      .select('*')
      .eq('employee_id', employeeId)
      .maybeSingle();

    if (error) {
      console.group('Payment Status Error Details');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error stack:', error.stack);
      console.groupEnd();
      throw error;
    }

    // If no record exists, create a new one with default values
    if (!data) {
      console.log('No payment status found, creating new record for employee:', employeeId);
      
      const newStatus = {
        employee_id: employeeId,
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

      // Insert the new status
      const { data: insertedData, error: insertError } = await supabase
        .from('payment_status')
        .insert([newStatus])
        .select()
        .single();

      if (insertError) {
        console.group('Payment Status Insert Error');
        console.error('Full error object:', insertError);
        console.error('Error message:', insertError.message);
        console.error('Error code:', insertError.code);
        console.error('Error details:', insertError.details);
        console.error('Error hint:', insertError.hint);
        console.error('Error stack:', insertError.stack);
        console.groupEnd();
        throw insertError;
      }

      console.log('Successfully created new payment status:', insertedData);
      return insertedData;
    }

    console.log('Found existing payment status:', data);
    return data;
  } catch (error) {
    console.group('Payment Status Operation Error');
    console.error('Operation failed for employee:', employeeId);
    console.error('Full error object:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.groupEnd();
    return null;
  }
};

// Update payment status for an employee
export const updatePaymentStatus = async (
  employeeId: string,
  months: Record<string, boolean>
): Promise<PaymentStatus | null> => {
  try {
    console.log('Updating payment status for employee:', employeeId);
    
    // First try to get existing status
    const existingStatus = await getEmployeePaymentStatus(employeeId);
    
    if (!existingStatus) {
      console.log('No existing status found, creating new record');
      
      // If no status exists, create a new one
      const newStatus = {
        employee_id: employeeId,
        year: new Date().getFullYear(),
        months
      };

      const { data, error } = await supabase
        .from('payment_status')
        .insert([newStatus])
        .select()
        .single();

      if (error) {
        console.group('Payment Status Update Error');
        console.error('Full error object:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Error stack:', error.stack);
        console.groupEnd();
        throw error;
      }

      console.log('Successfully created new payment status:', data);
      return data;
    }

    // Update existing status
    console.log('Updating existing payment status');
    const { data, error } = await supabase
      .from('payment_status')
      .update({ months })
      .eq('employee_id', employeeId)
      .select()
      .single();

    if (error) {
      console.group('Payment Status Update Error');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error stack:', error.stack);
      console.groupEnd();
      throw error;
    }

    console.log('Successfully updated payment status:', data);
    return data;
  } catch (error) {
    console.group('Payment Status Update Operation Error');
    console.error('Update operation failed for employee:', employeeId);
    console.error('Full error object:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.groupEnd();
    return null;
  }
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

// Helper to convert database snake_case to application camelCase for Bonus
const toCamelCaseBonus = (data: any): Bonus => ({
  id: data.id,
  employeeId: data.employee_id,
  amount: parseFloat(data.amount),
  reason: data.reason || '',
  date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
});

// Helper to convert application camelCase to database snake_case for Bonus
const toSnakeCaseBonus = (bonus: Omit<Bonus, "id">): any => ({
  employee_id: bonus.employeeId,
  amount: bonus.amount,
  reason: bonus.reason || null,
  date: bonus.date ? bonus.date.split('T')[0] : new Date().toISOString().split('T')[0], // Convert ISO string to DATE format (YYYY-MM-DD)
});

// Get all bonuses
export const getAllBonuses = async (): Promise<Bonus[]> => {
  const { data, error } = await supabase
    .from('bonuses')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching bonuses:', error);
    throw error;
  }

  return (data || []).map(toCamelCaseBonus);
};

// Get bonuses for a specific employee
export const getEmployeeBonuses = async (employeeId: string): Promise<Bonus[]> => {
  try {
    const { data, error } = await supabase
      .from('bonuses')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching employee bonuses:', error);
      throw error;
    }

    return (data || []).map(toCamelCaseBonus);
  } catch (error) {
    console.error('Error getting employee bonuses:', error);
    return [];
  }
};

// Add a new bonus
export const addBonus = async (bonus: Omit<Bonus, "id">): Promise<Bonus> => {
  const dbBonus = toSnakeCaseBonus(bonus);
  
  const { data, error } = await supabase
    .from('bonuses')
    .insert([dbBonus])
    .select()
    .single();

  if (error) {
    console.error('Error adding bonus:', error);
    throw error;
  }

  return toCamelCaseBonus(data);
};

// Calculate total bonuses for an employee
export const calculateTotalBonuses = async (employeeId: string): Promise<number> => {
  try {
    const bonuses = await getEmployeeBonuses(employeeId);
    return bonuses.reduce((total, bonus) => total + bonus.amount, 0);
  } catch (error) {
    console.error('Error calculating total bonuses:', error);
    return 0;
  }
};

// Calculate annual salary (base salary * 12 + bonuses)
export const calculateAnnualSalary = async (employee: Employee): Promise<number> => {
  try {
    const baseSalary = employee.salary * 12;
    const bonuses = await calculateTotalBonuses(employee.id);
    return baseSalary + bonuses;
  } catch (error) {
    console.error('Error calculating annual salary:', error);
    return employee.salary * 12; // Return just the base salary if bonus calculation fails
  }
};

// Count paid months for an employee
export const countPaidMonths = async (employeeId: string): Promise<number> => {
  try {
    const status = await getEmployeePaymentStatus(employeeId);
    
    if (!status || !status.months) {
      console.log('No payment status or months found for employee:', employeeId);
      return 0;
    }
    
    return Object.values(status.months).filter(isPaid => isPaid).length;
  } catch (error) {
    console.error('Error counting paid months:', error);
    return 0;
  }
};

// Update a bonus
export const updateBonus = async (bonus: Bonus): Promise<Bonus | null> => {
  const { id, ...bonusWithoutId } = bonus;
  const dbBonus = toSnakeCaseBonus(bonusWithoutId);
  
  const { data, error } = await supabase
    .from('bonuses')
    .update(dbBonus)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating bonus:', error);
    throw error;
  }

  return toCamelCaseBonus(data);
};

// Delete a bonus
export const deleteBonus = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('bonuses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting bonus:', error);
    throw error;
  }

  return true;
};
