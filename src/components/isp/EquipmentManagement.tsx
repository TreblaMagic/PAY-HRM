import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil } from 'lucide-react';
import { Equipment } from '@/types/isp';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface EquipmentManagementProps {
  equipment: Equipment[];
  onAddEquipment: (equipment: Omit<Equipment, "id">) => void;
  onUpdateEquipment: (equipment: Equipment) => void;
  isLoading?: boolean;
}

export const EquipmentManagement = ({ equipment, onAddEquipment, onUpdateEquipment, isLoading }: EquipmentManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  
  const handleOpenDialog = (equip?: Equipment) => {
    if (equip) {
      setCurrentEquipment(equip);
      setName(equip.name);
      setDescription(equip.description);
      setPrice(equip.price);
      setStock(equip.stock);
    } else {
      setCurrentEquipment(null);
      setName("");
      setDescription("");
      setPrice(0);
      setStock(0);
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (currentEquipment) {
      onUpdateEquipment({
        ...currentEquipment,
        name,
        description,
        price,
        stock
      });
    } else {
      onAddEquipment({
        name,
        description,
        price,
        stock
      });
    }
    setIsDialogOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Equipment List</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((equip) => (
          <Card key={equip.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{equip.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(equip)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{equip.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Price:</span>
                  <span className="ml-2">₦{equip.price}</span>
                </div>
                <div>
                  <span className="font-medium">In Stock:</span>
                  <span className="ml-2">{equip.stock}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentEquipment ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Equipment name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Equipment description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Equipment price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                placeholder="Quantity in stock"
              />
            </div>
            <Button onClick={handleSubmit} className="w-full">
              {currentEquipment ? 'Update Equipment' : 'Add Equipment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
