import React, { useState } from 'react';
import { ManagedService } from '@/types/isp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ManagedServicesManagementProps {
  services: ManagedService[];
  onAddService: (service: Omit<ManagedService, 'id'>) => void;
  onUpdateService: (service: ManagedService) => void;
  onDeleteService: (id: string) => void;
  isLoading?: boolean;
}

export const ManagedServicesManagement = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  isLoading
}: ManagedServicesManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ManagedService | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  const handleOpenDialog = (service?: ManagedService) => {
    if (service) {
      setCurrentService(service);
      setName(service.name);
      setDescription(service.description);
      setPrice(service.price);
    } else {
      setCurrentService(null);
      setName('');
      setDescription('');
      setPrice(0);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (currentService) {
      onUpdateService({
        ...currentService,
        name,
        description,
        price
      });
    } else {
      onAddService({
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
        <h3 className="text-lg font-medium">Managed Services</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{service.name}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(service)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteService(service.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
              <div className="text-sm">
                <span className="font-medium">Price:</span>
                <span className="ml-2">${service.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentService ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Service name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Service description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Service price"
              />
            </div>
            <Button onClick={handleSubmit} className="w-full">
              {currentService ? 'Update Service' : 'Add Service'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 