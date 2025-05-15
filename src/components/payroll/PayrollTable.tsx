
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { calculateAnnualSalary, countPaidMonths } from '@/services/payrollService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { User, DollarSign, CalendarCheck } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { PaymentStatusDialog } from './PaymentStatusDialog';
import { BonusDialog } from './BonusDialog';

interface PayrollTableProps {
  employees: Employee[];
}

export const PayrollTable = ({ employees }: PayrollTableProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isBonusDialogOpen, setIsBonusDialogOpen] = useState(false);

  const openPaymentDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsPaymentDialogOpen(true);
  };

  const openBonusDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsBonusDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden md:table-cell">Position</TableHead>
              <TableHead className="hidden md:table-cell">Monthly Salary</TableHead>
              <TableHead className="hidden md:table-cell">Annual Salary</TableHead>
              <TableHead className="hidden md:table-cell">Payments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {employee.position}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(employee.salary)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(calculateAnnualSalary(employee))}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <CalendarCheck className="mr-2 h-4 w-4 text-green-500" />
                      <span>{countPaidMonths(employee.id)} / 12 months</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openPaymentDialog(employee)}>
                        Payment Status
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openBonusDialog(employee)}>
                        Bonuses
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedEmployee && (
        <>
          <PaymentStatusDialog
            isOpen={isPaymentDialogOpen}
            onClose={() => setIsPaymentDialogOpen(false)}
            employee={selectedEmployee}
          />
          
          <BonusDialog
            isOpen={isBonusDialogOpen}
            onClose={() => setIsBonusDialogOpen(false)}
            employee={selectedEmployee}
          />
        </>
      )}
    </>
  );
};
