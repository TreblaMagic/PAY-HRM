
export type PaymentStatus = {
  employeeId: string;
  year: number;
  months: Record<string, boolean>;
};

export type Bonus = {
  id: string;
  employeeId: string;
  amount: number;
  reason: string;
  date: string;
};
