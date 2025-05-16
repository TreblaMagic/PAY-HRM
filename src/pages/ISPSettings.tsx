
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { EquipmentManagement } from '@/components/isp/EquipmentManagement';
import { InternetSpeedManagement } from '@/components/isp/InternetSpeedManagement';
import { MarkupSettings } from '@/components/isp/MarkupSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Equipment, 
  InternetSpeed, 
  MarkupSettings as MarkupSettingsType 
} from '@/types/isp';
import { 
  getEquipment,
  getInternetSpeeds,
  getMarkupSettings,
  updateEquipment,
  updateInternetSpeed,
  updateMarkupSettings
} from '@/services/ispService';

const ISPSettings = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [internetSpeeds, setInternetSpeeds] = useState<InternetSpeed[]>([]);
  const [markupSettings, setMarkupSettings] = useState<MarkupSettingsType>({
    equipmentMarkup: 0,
    mbpsMarkup: 0,
    setupMarkup: 0,
    managedServicesMarkup: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipData, speedsData, markupData] = await Promise.all([
          getEquipment(),
          getInternetSpeeds(),
          getMarkupSettings()
        ]);
        
        setEquipment(equipData);
        setInternetSpeeds(speedsData);
        setMarkupSettings(markupData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load settings data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const handleAddEquipment = async (newEquipment: Omit<Equipment, "id">) => {
    try {
      const updatedEquipment = await updateEquipment({
        ...newEquipment,
        id: ""
      });
      setEquipment(updatedEquipment);
      toast({
        title: "Success",
        description: "Equipment added successfully",
      });
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast({
        title: "Error",
        description: "Failed to add equipment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateEquipment = async (updatedEquipment: Equipment) => {
    try {
      const result = await updateEquipment(updatedEquipment);
      setEquipment(result);
      toast({
        title: "Success",
        description: "Equipment updated successfully",
      });
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Error",
        description: "Failed to update equipment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddSpeed = async (newSpeed: Omit<InternetSpeed, "id">) => {
    try {
      const updatedSpeeds = await updateInternetSpeed({
        ...newSpeed,
        id: ""
      });
      setInternetSpeeds(updatedSpeeds);
      toast({
        title: "Success",
        description: "Internet speed package added successfully",
      });
    } catch (error) {
      console.error('Error adding internet speed:', error);
      toast({
        title: "Error",
        description: "Failed to add internet speed package. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateSpeed = async (updatedSpeed: InternetSpeed) => {
    try {
      const result = await updateInternetSpeed(updatedSpeed);
      setInternetSpeeds(result);
      toast({
        title: "Success",
        description: "Internet speed package updated successfully",
      });
    } catch (error) {
      console.error('Error updating internet speed:', error);
      toast({
        title: "Error",
        description: "Failed to update internet speed package. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateMarkupSettings = async (updatedSettings: MarkupSettingsType) => {
    try {
      const result = await updateMarkupSettings(updatedSettings);
      setMarkupSettings(result);
      toast({
        title: "Success",
        description: "Markup settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating markup settings:', error);
      toast({
        title: "Error",
        description: "Failed to update markup settings. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const goBack = () => {
    navigate('/isp');
  };
  
  if (loading) {
    return (
      <DashboardLayout title="ISP Settings" activePage="dashboard">
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="ISP Settings" activePage="dashboard">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={goBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ISP Services
          </Button>
          <div>
            <h1 className="text-2xl font-bold">ISP Settings</h1>
            <p className="text-gray-500">Configure equipment, pricing, and markup settings</p>
          </div>
        </div>
        
        <div className="space-y-8">
          <MarkupSettings 
            markupSettings={markupSettings}
            onUpdateMarkupSettings={handleUpdateMarkupSettings}
          />
          
          <EquipmentManagement 
            equipment={equipment}
            onAddEquipment={handleAddEquipment}
            onUpdateEquipment={handleUpdateEquipment}
          />
          
          <InternetSpeedManagement 
            speeds={internetSpeeds}
            onAddSpeed={handleAddSpeed}
            onUpdateSpeed={handleUpdateSpeed}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                More configuration options will be available in future updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ISPSettings;
