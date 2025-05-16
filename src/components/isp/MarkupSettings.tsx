
import { useState } from "react";
import { MarkupSettings as MarkupSettingsType } from "@/types/isp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MarkupSettingsProps {
  markupSettings: MarkupSettingsType;
  onUpdateMarkupSettings: (settings: MarkupSettingsType) => void;
}

export const MarkupSettings = ({
  markupSettings,
  onUpdateMarkupSettings
}: MarkupSettingsProps) => {
  const [formData, setFormData] = useState<MarkupSettingsType>(markupSettings);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMarkupSettings(formData);
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Markup Settings</CardTitle>
          <CardDescription>Configure percentage markup for various services</CardDescription>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            Edit Settings
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentMarkup">Equipment Markup (%)</Label>
                <Input 
                  id="equipmentMarkup" 
                  name="equipmentMarkup" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.equipmentMarkup} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mbpsMarkup">Internet Speed Markup (%)</Label>
                <Input 
                  id="mbpsMarkup" 
                  name="mbpsMarkup" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.mbpsMarkup} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setupMarkup">Setup Fee Markup (%)</Label>
                <Input 
                  id="setupMarkup" 
                  name="setupMarkup" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.setupMarkup} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managedServicesMarkup">Managed Services Markup (%)</Label>
                <Input 
                  id="managedServicesMarkup" 
                  name="managedServicesMarkup" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.managedServicesMarkup} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => {
                setIsEditing(false);
                setFormData(markupSettings);
              }}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-500">Equipment Markup</p>
              <p className="text-2xl font-semibold">{markupSettings.equipmentMarkup}%</p>
            </div>
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-500">Internet Speed Markup</p>
              <p className="text-2xl font-semibold">{markupSettings.mbpsMarkup}%</p>
            </div>
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-500">Setup Fee Markup</p>
              <p className="text-2xl font-semibold">{markupSettings.setupMarkup}%</p>
            </div>
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-500">Managed Services Markup</p>
              <p className="text-2xl font-semibold">{markupSettings.managedServicesMarkup}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
