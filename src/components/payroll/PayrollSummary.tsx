import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { 
  calculateAnnualSalary, 
  calculateTotalBonuses, 
  countPaidMonths 
} from '@/services/payrollService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { DollarSign, Users, CheckCheck, Gift } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface PayrollSummaryProps {
  employees: Employee[];
}

export const PayrollSummary = ({ employees }: PayrollSummaryProps) => {
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalAnnualSalaries, setTotalAnnualSalaries] = useState(0);
  const [totalBonusesPaid, setTotalBonusesPaid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateTotals = async () => {
      try {
        if (!Array.isArray(employees)) {
          console.error('Employees is not an array:', employees);
          return;
        }

        // Calculate total payments
        const paymentsPromises = employees.map(emp => countPaidMonths(emp.id));
        const payments = await Promise.all(paymentsPromises);
        const totalPaid = payments.reduce((sum, count) => sum + count, 0);
        setTotalPayments(totalPaid);

        // Calculate total annual salaries
        const salaryPromises = employees.map(emp => calculateAnnualSalary(emp));
        const salaries = await Promise.all(salaryPromises);
        const totalAnnual = salaries.reduce((sum, salary) => sum + salary, 0);
        setTotalAnnualSalaries(totalAnnual);

        // Calculate total bonuses
        const bonusPromises = employees.map(emp => calculateTotalBonuses(emp.id));
        const bonuses = await Promise.all(bonusPromises);
        const totalBonuses = bonuses.reduce((sum, bonus) => sum + bonus, 0);
        setTotalBonusesPaid(totalBonuses);
      } catch (error) {
        console.error('Error calculating totals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateTotals();
  }, [employees]);

  const totalMonthlySalaries = Array.isArray(employees) 
    ? employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) 
    : 0;
  
  const maxPossiblePayments = employees.length * 12;
  const paymentRate = maxPossiblePayments > 0 ? (totalPayments / maxPossiblePayments) * 100 : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-24">
                <Spinner />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Payroll
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{formatCurrency(totalMonthlySalaries)}</div>
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Total monthly salaries across {employees.length} employees
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Annual Payroll
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{formatCurrency(totalAnnualSalaries)}</div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Total annual salaries including all bonuses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{paymentRate.toFixed(1)}%</div>
            <div className="p-2 bg-primary/10 rounded-full">
              <CheckCheck className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {totalPayments} of {maxPossiblePayments} monthly payments completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Bonuses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{formatCurrency(totalBonusesPaid)}</div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Gift className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Total bonuses distributed this year
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
