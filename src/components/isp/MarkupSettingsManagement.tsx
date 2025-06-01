import React, { useState } from 'react';
import { MarkupSettings } from '@/types/isp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';

interface MarkupSettingsManagementProps {
  settings: MarkupSettings;
  onUpdateSettings: (settings: MarkupSettings) => void;
  isLoading?: boolean;
}

export const MarkupSettingsManagement = ({ settings, onUpdateSettings, isLoading }: MarkupSettingsManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [equipmentMarkup, setEquipmentMarkup] = useState(settings.equipmentMarkup);
  const [mbpsMarkup, setMbpsMarkup] = useState(settings.mbpsMarkup);
  const [setupMarkup, setSetupMarkup] = useState(settings.setupMarkup);
  const [managedServicesMarkup, setManagedServicesMarkup] = useState(settings.managedServicesMarkup);

  const handleOpenDialog = () => {
    setEquipmentMarkup(settings.equipmentMarkup);
    setMbpsMarkup(settings.mbpsMarkup);
    setSetupMarkup(settings.setupMarkup);
    setManagedServicesMarkup(settings.managedServicesMarkup);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    onUpdateSettings({
      equipmentMarkup,
      mbpsMarkup,
      setupMarkup,
      managedServicesMarkup
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Markup Settings</h3>
        <Button onClick={handleOpenDialog}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Equipment Markup</p>
              <p className="text-lg font-medium">{settings.equipmentMarkup}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Internet Speed Markup</p>
              <p className="text-lg font-medium">{settings.mbpsMarkup}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Setup Cost Markup</p>
              <p className="text-lg font-medium">{settings.setupMarkup}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Managed Services Markup</p>
              <p className="text-lg font-medium">{settings.managedServicesMarkup}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Markup Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentMarkup">Equipment Markup (%)</Label>
              <Input
                id="equipmentMarkup"
                type="number"
                value={equipmentMarkup}
                onChange={(e) => setEquipmentMarkup(Number(e.target.value))}
                placeholder="Enter equipment markup percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mbpsMarkup">Internet Speed Markup (%)</Label>
              <Input
                id="mbpsMarkup"
                type="number"
                value={mbpsMarkup}
                onChange={(e) => setMbpsMarkup(Number(e.target.value))}
                placeholder="Enter internet speed markup percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setupMarkup">Setup Cost Markup (%)</Label>
              <Input
                id="setupMarkup"
                type="number"
                value={setupMarkup}
                onChange={(e) => setSetupMarkup(Number(e.target.value))}
                placeholder="Enter setup cost markup percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managedServicesMarkup">Managed Services Markup (%)</Label>
              <Input
                id="managedServicesMarkup"
                type="number"
                value={managedServicesMarkup}
                onChange={(e) => setManagedServicesMarkup(Number(e.target.value))}
                placeholder="Enter managed services markup percentage"
              />
            </div>
            <Button onClick={handleSubmit} className="w-full">
              Update Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 