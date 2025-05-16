
import { useState } from "react";
import { Equipment } from "@/types/isp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface EquipmentManagementProps {
  equipment: Equipment[];
  onAddEquipment: (equipment: Omit<Equipment, "id">) => void;
  onUpdateEquipment: (equipment: Equipment) => void;
}

export const EquipmentManagement = ({
  equipment,
  onAddEquipment,
  onUpdateEquipment
}: EquipmentManagementProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Equipment, "id">>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "https://placehold.co/200x200?text=Equipment",
    quantity: 1,
    inStock: 0
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "quantity" || name === "inStock" 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEquipment(formData);
    setFormData({
      name: "",
      description: "",
      price: 0,
      imageUrl: "https://placehold.co/200x200?text=Equipment",
      quantity: 1,
      inStock: 0
    });
    setIsAdding(false);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateEquipment({
        id: editingId,
        ...formData
      });
      setEditingId(null);
    }
  };
  
  const startEditing = (item: Equipment) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      inStock: item.inStock
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Equipment Management</CardTitle>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="space-y-4 mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium">Add New Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inStock">In Stock</Label>
                <Input 
                  id="inStock" 
                  name="inStock" 
                  type="number" 
                  min="0" 
                  value={formData.inStock} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Equipment</Button>
            </div>
          </form>
        )}

        {editingId && (
          <form onSubmit={handleEditSubmit} className="space-y-4 mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium">Edit Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inStock">In Stock</Label>
                <Input 
                  id="inStock" 
                  name="inStock" 
                  type="number" 
                  min="0" 
                  value={formData.inStock} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Equipment</Button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item) => (
            <div key={item.id} className="border rounded-md p-4 flex flex-col">
              <div className="mb-3 aspect-square overflow-hidden rounded-md bg-gray-100">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.description}</p>
              <div className="flex justify-between mt-auto">
                <p className="font-medium">${item.price}</p>
                <p className="text-sm text-gray-600">{item.inStock} in stock</p>
              </div>
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => startEditing(item)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
