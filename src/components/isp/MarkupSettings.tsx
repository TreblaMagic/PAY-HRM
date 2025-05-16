
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MarkupSettings as MarkupSettingsType } from '@/types/isp';

interface MarkupSettingsProps {
  markupSettings: MarkupSettingsType;
  onUpdateMarkupSettings: (settings: MarkupSettingsType) => void;
}

export const MarkupSettings = ({ markupSettings, onUpdateMarkupSettings }: MarkupSettingsProps) => {
  const [settings, setSettings] = useState<MarkupSettingsType>({
    equipmentMarkup: markupSettings.equipmentMarkup,
    mbpsMarkup: markupSettings.mbpsMarkup,
    setupMarkup: markupSettings.setupMarkup,
    managedServicesMarkup: markupSettings.managedServicesMarkup
  });
  
  const handleChange = (field: keyof MarkupSettingsType, value: number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMarkupSettings(settings);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Markup Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentMarkup">Equipment Markup (%)</Label>
              <Input 
                id="equipmentMarkup" 
                type="number" 
                value={settings.equipmentMarkup.toString()} 
                min={0}
                max={100}
                onChange={(e) => handleChange('equipmentMarkup', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mbpsMarkup">Internet Speed (MBPS) Markup (%)</Label>
              <Input 
                id="mbpsMarkup" 
                type="number" 
                value={settings.mbpsMarkup.toString()}
                min={0} 
                max={100}
                onChange={(e) => handleChange('mbpsMarkup', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setupMarkup">Setup Cost Markup (%)</Label>
              <Input 
                id="setupMarkup" 
                type="number" 
                value={settings.setupMarkup.toString()} 
                min={0}
                max={100}
                onChange={(e) => handleChange('setupMarkup', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managedServicesMarkup">Managed Services Markup (%)</Label>
              <Input 
                id="managedServicesMarkup" 
                type="number" 
                value={settings.managedServicesMarkup.toString()}
                min={0} 
                max={100}
                onChange={(e) => handleChange('managedServicesMarkup', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Save Markup Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
};
