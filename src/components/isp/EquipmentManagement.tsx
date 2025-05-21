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
}

export const EquipmentManagement = ({ equipment, onAddEquipment, onUpdateEquipment }: EquipmentManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("https://placehold.co/200x200");
  const [inStock, setInStock] = useState(0);
  
  const handleOpenDialog = (equip?: Equipment) => {
    if (equip) {
      setCurrentEquipment(equip);
      setName(equip.name);
      setDescription(equip.description);
      setPrice(equip.price);
      setImageUrl(equip.imageUrl);
      setInStock(equip.inStock);
    } else {
      setCurrentEquipment(null);
      setName("");
      setDescription("");
      setPrice(0);
      setImageUrl("https://placehold.co/200x200");
      setInStock(0);
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
        imageUrl,
        inStock
      });
    } else {
      onAddEquipment({
        name,
        description,
        price,
        imageUrl,
        quantity: 1,
        inStock
      });
    }
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Equipment Management</CardTitle>
          <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Equipment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((equip) => (
              <div key={equip.id} className="border rounded-lg p-4 flex flex-col">
                <div className="aspect-square mb-3 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                  <img 
                    src={equip.imageUrl} 
                    alt={equip.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/200x200?text=Error";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{equip.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{equip.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="font-medium">₦{equip.price}</p>
                      <p className="text-xs text-gray-500">{equip.inStock} in stock</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(equip)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {equipment.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No equipment found. Add equipment using the button above.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentEquipment ? "Edit Equipment" : "Add New Equipment"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Router, Switch, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Brief description of the equipment"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  value={price}
                  min={0}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inStock">In Stock</Label>
                <Input 
                  id="inStock" 
                  type="number" 
                  value={inStock}
                  min={0}
                  onChange={(e) => setInStock(parseInt(e.target.value) || 0)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input 
                id="imageUrl" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                placeholder="https://example.com/image.jpg"
              />
              <div className="mt-2 aspect-square w-24 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                <img 
                  src={imageUrl} 
                  alt="Equipment preview" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/200x200?text=Error";
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{currentEquipment ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
