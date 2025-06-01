import React, { useState } from 'react';
import { SetupCost } from '@/types/isp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface SetupCostsManagementProps {
  costs: SetupCost[];
  onAddCost: (cost: Omit<SetupCost, 'id'>) => void;
  onUpdateCost: (cost: SetupCost) => void;
  onDeleteCost: (id: string) => void;
  isLoading?: boolean;
}

export const SetupCostsManagement = ({
  costs,
  onAddCost,
  onUpdateCost,
  onDeleteCost,
  isLoading
}: SetupCostsManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCost, setCurrentCost] = useState<SetupCost | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  const handleOpenDialog = (cost?: SetupCost) => {
    if (cost) {
      setCurrentCost(cost);
      setName(cost.name);
      setDescription(cost.description);
      setPrice(cost.price);
    } else {
      setCurrentCost(null);
      setName('');
      setDescription('');
      setPrice(0);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (currentCost) {
      onUpdateCost({
        ...currentCost,
        name,
        description,
        price
      });
    } else {
      onAddCost({
        name,
        description,
        price
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Setup Costs</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Setup Cost
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {costs.map((cost) => (
          <Card key={cost.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{cost.name}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(cost)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteCost(cost.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{cost.description}</p>
              <div className="text-sm">
                <span className="font-medium">Price:</span>
                <span className="ml-2">₦{cost.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCost ? 'Edit Setup Cost' : 'Add Setup Cost'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Setup cost name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Setup cost description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Setup cost price"
              />
            </div>
            <Button onClick={handleSubmit} className="w-full">
              {currentCost ? 'Update Setup Cost' : 'Add Setup Cost'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 