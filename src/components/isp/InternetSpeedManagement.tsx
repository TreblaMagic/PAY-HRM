import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil } from 'lucide-react';
import { InternetSpeed } from '@/types/isp';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface InternetSpeedManagementProps {
  speeds: InternetSpeed[];
  onAddSpeed: (speed: Omit<InternetSpeed, "id">) => void;
  onUpdateSpeed: (speed: InternetSpeed) => void;
}

export const InternetSpeedManagement = ({ speeds, onAddSpeed, onUpdateSpeed }: InternetSpeedManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState<InternetSpeed | null>(null);
  const [mbps, setMbps] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  
  const handleOpenDialog = (speed?: InternetSpeed) => {
    if (speed) {
      setCurrentSpeed(speed);
      setMbps(speed.mbps);
      setPrice(speed.price);
      setDescription(speed.description);
    } else {
      setCurrentSpeed(null);
      setMbps(0);
      setPrice(0);
      setDescription("");
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (currentSpeed) {
      onUpdateSpeed({
        ...currentSpeed,
        mbps,
        price,
        description
      });
    } else {
      onAddSpeed({
        mbps,
        price,
        description
      });
    }
    setIsDialogOpen(false);
  };
  
  // Sort speeds in ascending order
  const sortedSpeeds = [...speeds].sort((a, b) => a.mbps - b.mbps);
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Internet Speed Management</CardTitle>
          <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Speed Package
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Speed (Mbps)</th>
                  <th className="text-left py-2 px-4">Price (₦)</th>
                  <th className="text-left py-2 px-4 hidden md:table-cell">Description</th>
                  <th className="text-right py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedSpeeds.map((speed) => (
                  <tr key={speed.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{speed.mbps}</td>
                    <td className="py-2 px-4">₦{speed.price}</td>
                    <td className="py-2 px-4 hidden md:table-cell text-gray-500 truncate max-w-[300px]">
                      {speed.description}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(speed)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {speeds.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No speed packages found. Add a speed package using the button above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentSpeed ? "Edit Speed Package" : "Add New Speed Package"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mbps">Speed (Mbps)</Label>
              <Input 
                id="mbps" 
                type="number" 
                value={mbps}
                min={1}
                onChange={(e) => setMbps(parseInt(e.target.value) || 0)} 
              />
            </div>
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
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="e.g. Suitable for streaming and light browsing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{currentSpeed ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
