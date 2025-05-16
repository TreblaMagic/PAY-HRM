
import { useState } from "react";
import { InternetSpeed } from "@/types/isp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";

interface InternetSpeedManagementProps {
  speeds: InternetSpeed[];
  onUpdateSpeed: (speed: InternetSpeed) => void;
  onAddSpeed: (speed: Omit<InternetSpeed, "id">) => void;
}

export const InternetSpeedManagement = ({
  speeds,
  onUpdateSpeed,
  onAddSpeed
}: InternetSpeedManagementProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<InternetSpeed, "id">>({
    mbps: 0,
    price: 0,
    description: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "mbps" || name === "price" ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSpeed(formData);
    setFormData({
      mbps: 0,
      price: 0,
      description: ""
    });
    setIsAdding(false);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateSpeed({
        id: editingId,
        ...formData
      });
      setEditingId(null);
    }
  };
  
  const startEditing = (speed: InternetSpeed) => {
    setEditingId(speed.id);
    setFormData({
      mbps: speed.mbps,
      price: speed.price,
      description: speed.description
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Internet Speed Packages</CardTitle>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Speed Package
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="space-y-4 mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium">Add New Internet Speed</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mbps">Speed (Mbps)</Label>
                <Input 
                  id="mbps" 
                  name="mbps" 
                  type="number" 
                  min="1" 
                  value={formData.mbps} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Monthly Price ($)</Label>
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Speed Package</Button>
            </div>
          </form>
        )}

        {editingId && (
          <form onSubmit={handleEditSubmit} className="space-y-4 mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium">Edit Internet Speed</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mbps">Speed (Mbps)</Label>
                <Input 
                  id="mbps" 
                  name="mbps" 
                  type="number" 
                  min="1" 
                  value={formData.mbps} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Monthly Price ($)</Label>
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Speed Package</Button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {speeds.map((speed) => (
            <div key={speed.id} className="border rounded-md p-4 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{speed.mbps} Mbps</h3>
                  <p className="text-sm text-gray-500">{speed.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${speed.price}/mo</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => startEditing(speed)}
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
