
import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { Bonus } from '@/types/payroll';
import { 
  addBonus, 
  getEmployeeBonuses, 
  deleteBonus, 
  calculateTotalBonuses 
} from '@/services/payrollService';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { Calendar, DollarSign, Trash2 } from 'lucide-react';

interface BonusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

export const BonusDialog = ({ isOpen, onClose, employee }: BonusDialogProps) => {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [newAmount, setNewAmount] = useState<string>("");
  const [newReason, setNewReason] = useState<string>("");
  const [totalBonus, setTotalBonus] = useState<number>(0);
  
  useEffect(() => {
    if (isOpen) {
      loadBonuses();
    }
  }, [isOpen, employee.id]);

  const loadBonuses = () => {
    const employeeBonuses = getEmployeeBonuses(employee.id);
    setBonuses(employeeBonuses);
    setTotalBonus(calculateTotalBonuses(employee.id));
    
    // Reset form fields
    setNewAmount("");
    setNewReason("");
  };
  
  const handleAddBonus = () => {
    if (!newAmount || !newReason) {
      toast({
        title: "Missing information",
        description: "Please provide both amount and reason for the bonus.",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bonus amount.",
        variant: "destructive"
      });
      return;
    }
    
    addBonus({
      employeeId: employee.id,
      amount,
      reason: newReason,
      date: new Date().toISOString()
    });
    
    toast({
      title: "Bonus added",
      description: `Bonus of ${formatCurrency(amount)} added for ${employee.name}.`
    });
    
    loadBonuses();
  };
  
  const handleDeleteBonus = (bonusId: string) => {
    deleteBonus(bonusId);
    loadBonuses();
    
    toast({
      title: "Bonus deleted",
      description: "The bonus has been removed."
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bonuses for {employee.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Add New Bonus</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  placeholder="Performance bonus, Holiday bonus, etc."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                />
              </div>
              
              <Button onClick={handleAddBonus}>
                Add Bonus
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">Bonus History</h3>
              <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                Total: {formatCurrency(totalBonus)}
              </div>
            </div>
            
            {bonuses.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No bonus history found</p>
            ) : (
              <div className="space-y-3">
                {bonuses.map((bonus) => (
                  <div key={bonus.id} className="flex items-center justify-between border p-3 rounded-md">
                    <div className="space-y-1">
                      <div className="font-medium">{formatCurrency(bonus.amount)}</div>
                      <div className="text-sm text-muted-foreground">{bonus.reason}</div>
                      <div className="text-xs flex items-center text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(bonus.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteBonus(bonus.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
