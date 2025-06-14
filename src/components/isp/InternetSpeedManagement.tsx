import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import type { InternetSpeed } from '@/types/isp';

interface InternetSpeedManagementProps {
  speeds: InternetSpeed[];
  onAddSpeed: (speed: Omit<InternetSpeed, 'id'>) => Promise<void>;
  onUpdateSpeed: (speed: InternetSpeed) => Promise<void>;
  isLoading: boolean;
}

export const InternetSpeedManagement: React.FC<InternetSpeedManagementProps> = ({
  speeds,
  onAddSpeed,
  onUpdateSpeed,
  isLoading
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<InternetSpeed | null>(null);
  const [newSpeed, setNewSpeed] = useState<Omit<InternetSpeed, 'id'>>({
    mbps: 0,
    description: '',
    price: 0
  });

  const handleAddSpeed = async () => {
    try {
      await onAddSpeed(newSpeed);
      setNewSpeed({ mbps: 0, description: '', price: 0 });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding speed:', error);
      toast.error('Failed to add internet speed');
    }
  };

  const handleEditSpeed = async () => {
    if (!selectedSpeed) return;
    try {
      await onUpdateSpeed(selectedSpeed);
      setIsEditDialogOpen(false);
      setSelectedSpeed(null);
    } catch (error) {
      console.error('Error updating speed:', error);
      toast.error('Failed to update internet speed');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Internet Speeds</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Speed
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Internet Speed</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="mbps">Mbps</Label>
                <Input
                  id="mbps"
                  type="number"
                  value={newSpeed.mbps}
                  onChange={(e) => setNewSpeed({ ...newSpeed, mbps: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSpeed.description}
                  onChange={(e) => setNewSpeed({ ...newSpeed, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newSpeed.price}
                  onChange={(e) => setNewSpeed({ ...newSpeed, price: Number(e.target.value) })}
                />
              </div>
              <Button onClick={handleAddSpeed}>Add Speed</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mbps</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {speeds.map((speed) => (
              <TableRow key={speed.id}>
                <TableCell>{speed.mbps}</TableCell>
                <TableCell>{speed.description}</TableCell>
                <TableCell>₦{speed.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Dialog open={isEditDialogOpen && selectedSpeed?.id === speed.id} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedSpeed(speed)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Internet Speed</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-mbps">Mbps</Label>
                          <Input
                            id="edit-mbps"
                            type="number"
                            value={selectedSpeed?.mbps}
                            onChange={(e) => setSelectedSpeed(prev => prev ? { ...prev, mbps: Number(e.target.value) } : null)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={selectedSpeed?.description}
                            onChange={(e) => setSelectedSpeed(prev => prev ? { ...prev, description: e.target.value } : null)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-price">Price</Label>
                          <Input
                            id="edit-price"
                            type="number"
                            value={selectedSpeed?.price}
                            onChange={(e) => setSelectedSpeed(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                          />
                        </div>
                        <Button onClick={handleEditSpeed}>Save Changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
