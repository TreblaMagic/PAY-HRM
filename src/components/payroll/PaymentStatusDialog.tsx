
import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { getEmployeePaymentStatus, updatePaymentStatus } from '@/services/payrollService';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PaymentStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

export const PaymentStatusDialog = ({ isOpen, onClose, employee }: PaymentStatusDialogProps) => {
  const [paymentStatus, setPaymentStatus] = useState<Record<string, boolean>>({});
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (isOpen) {
      const status = getEmployeePaymentStatus(employee.id);
      if (status) {
        setPaymentStatus(status.months);
      }
    }
  }, [isOpen, employee.id]);

  const handleChange = (month: string, checked: boolean) => {
    setPaymentStatus(prev => ({
      ...prev,
      [month]: checked
    }));
    
    updatePaymentStatus(employee.id, month, checked);
  };

  const handleSave = () => {
    toast({
      title: "Payment status updated",
      description: `Payment status for ${employee.name} has been updated.`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Status for {employee.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monthNames.map((month) => (
              <div key={month} className="flex items-center justify-between space-x-4 border p-3 rounded-md">
                <span className="font-medium">{month}</span>
                <Switch
                  checked={paymentStatus[month] || false}
                  onCheckedChange={(checked) => handleChange(month, checked)}
                />
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
