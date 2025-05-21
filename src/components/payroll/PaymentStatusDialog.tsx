import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { getEmployeePaymentStatus, updateMultiplePaymentStatus } from '@/services/payrollService';
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
import { AlertCircle } from 'lucide-react';

interface PaymentStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

export const PaymentStatusDialog = ({ isOpen, onClose, employee }: PaymentStatusDialogProps) => {
  const [tempPaymentStatus, setTempPaymentStatus] = useState<Record<string, boolean>>({});
  const [originalPaymentStatus, setOriginalPaymentStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsLoading(true);
      try {
        const status = getEmployeePaymentStatus(employee.id);
        if (status) {
          // Clone the current payment status for both temporary and original states
          setTempPaymentStatus({ ...status.months });
          setOriginalPaymentStatus({ ...status.months });
        }
      } catch (err) {
        setError('Failed to load payment status. Please try again.');
        console.error('Error loading payment status:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isOpen, employee.id]);

  const handleChange = (month: string, checked: boolean) => {
    setTempPaymentStatus(prev => ({
      ...prev,
      [month]: checked
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update all months' status at once
      const result = updateMultiplePaymentStatus(employee.id, tempPaymentStatus);
      
      if (result) {
        toast({
          title: "Payment status updated",
          description: `Payment status for ${employee.name} has been updated.`
        });
        onClose();
      } else {
        throw new Error('Failed to update payment status');
      }
    } catch (err) {
      setError('Failed to update payment status. Please try again.');
      console.error('Error updating payment status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset temporary state to original state
    setTempPaymentStatus({ ...originalPaymentStatus });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Status for {employee.name}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-50 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monthNames.map((month) => (
              <div key={month} className="flex items-center justify-between space-x-4 border p-3 rounded-md">
                <span className="font-medium">{month}</span>
                <Switch
                  checked={tempPaymentStatus[month] || false}
                  onCheckedChange={(checked) => handleChange(month, checked)}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
