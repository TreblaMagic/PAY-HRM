import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { getEmployeePaymentStatus, updatePaymentStatus } from '@/services/payrollService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PaymentStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const PaymentStatusDialog = ({ isOpen, onClose, employee }: PaymentStatusDialogProps) => {
  const [tempPaymentStatus, setTempPaymentStatus] = useState<Record<string, boolean>>({});
  const [originalPaymentStatus, setOriginalPaymentStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPaymentStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, employee.id]);

  const loadPaymentStatus = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const status = await getEmployeePaymentStatus(employee.id);
      if (status) {
        setTempPaymentStatus({ ...status.months });
        setOriginalPaymentStatus({ ...status.months });
      } else {
        // Initialize with all months unpaid if no status exists
        const initialStatus = monthNames.reduce((acc, month) => ({
          ...acc,
          [month]: false
        }), {});
        setTempPaymentStatus(initialStatus);
        setOriginalPaymentStatus(initialStatus);
      }
    } catch (err) {
      setError('Failed to load payment status. Please try again.');
      console.error('Error loading payment status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (month: string, checked: boolean) => {
    setTempPaymentStatus(prev => ({
      ...prev,
      [month]: checked
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePaymentStatus(employee.id, tempPaymentStatus);
      setOriginalPaymentStatus(tempPaymentStatus);
      toast({
        title: 'Success',
        description: 'Payment status updated successfully',
      });
      onClose();
    } catch (err) {
      setError('Failed to save payment status. Please try again.');
      console.error('Error saving payment status:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempPaymentStatus(originalPaymentStatus);
    onClose();
  };

  const hasChanges = () => {
    return Object.keys(tempPaymentStatus).some(
      month => tempPaymentStatus[month] !== originalPaymentStatus[month]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl p-0 bg-white">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Payment Status for {employee.name}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 py-2">
              {monthNames.map((month) => (
                <div
                  key={month}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
                >
                  <span className="text-sm text-gray-800 font-normal">{month}</span>
                  {/* Custom pill toggle */}
                  <button
                    type="button"
                    aria-pressed={tempPaymentStatus[month] || false}
                    onClick={() => handleChange(month, !tempPaymentStatus[month])}
                    className={`relative w-11 h-6 transition-colors duration-200 focus:outline-none rounded-full
                      ${tempPaymentStatus[month] ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                        ${tempPaymentStatus[month] ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-end gap-2 px-6 pb-6 pt-2 border-t border-gray-100 bg-white rounded-b-xl">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading || isSaving}
            className="rounded-lg bg-gray-50 border border-gray-200 text-gray-800 hover:bg-gray-100 hover:border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || isSaving || !hasChanges()}
            className="rounded-lg bg-gray-900 text-white hover:bg-gray-800 px-6"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
