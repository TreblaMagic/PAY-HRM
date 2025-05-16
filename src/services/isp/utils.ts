
// Generate a unique ID for invoices
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
};

// Format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
