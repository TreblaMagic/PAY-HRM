import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { EquipmentManagement } from '@/components/isp/EquipmentManagement';
import { InternetSpeedManagement } from '@/components/isp/InternetSpeedManagement';
import { MarkupSettingsManagement } from '@/components/isp/MarkupSettingsManagement';
import { SetupCostsManagement } from '@/components/isp/SetupCostsManagement';
import { ManagedServicesManagement } from '@/components/isp/ManagedServicesManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  getEquipment,
  getInternetSpeeds,
  getMarkupSettings,
  getSetupCosts,
  getManagedServices,
  updateEquipment,
  updateInternetSpeed,
  updateMarkupSettings,
  addSetupCost,
  updateSetupCost,
  deleteSetupCost,
  addManagedService,
  updateManagedService,
  deleteManagedService,
  addEquipment,
  addInternetSpeed
} from '@/services/isp/settingsService';
import type { Equipment, InternetSpeed, MarkupSettings, SetupCost, ManagedService } from '@/types/isp';

const ISPSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [speeds, setSpeeds] = useState<InternetSpeed[]>([]);
  const [markupSettings, setMarkupSettings] = useState<MarkupSettings>({
    equipmentMarkup: 25,
    mbpsMarkup: 30,
    setupMarkup: 20,
    managedServicesMarkup: 35
  });
  const [setupCosts, setSetupCosts] = useState<SetupCost[]>([]);
  const [managedServices, setManagedServices] = useState<ManagedService[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchAllSettings();
  }, [user, navigate]);

  const fetchAllSettings = async () => {
    try {
      setIsLoading(true);
      const [equipmentData, speedsData, markupData, costsData, servicesData] = await Promise.all([
        getEquipment(),
        getInternetSpeeds(),
        getMarkupSettings(),
        getSetupCosts(),
        getManagedServices()
      ]);

      setEquipment(equipmentData || []);
      setSpeeds(speedsData || []);
      setMarkupSettings(markupData || { equipmentMarkup: 25, mbpsMarkup: 30, setupMarkup: 20, managedServicesMarkup: 35 });
      setSetupCosts(costsData || []);
      setManagedServices(servicesData || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEquipment = async (equipment: Omit<Equipment, 'id'>) => {
    try {
      // Validate required fields
      if (!equipment.name || !equipment.description || equipment.price === undefined || equipment.stock === undefined) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate numeric fields
      if (isNaN(equipment.price) || isNaN(equipment.stock) || equipment.price < 0 || equipment.stock < 0) {
        toast.error('Price and stock must be valid numbers');
        return;
      }

      await addEquipment(equipment);
      await fetchAllSettings();
      toast.success('Equipment added successfully');
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast.error('Failed to add equipment');
    }
  };

  const handleUpdateEquipment = async (equipment: Equipment) => {
    try {
      await updateEquipment([equipment]);
      setEquipment((prev) => prev.map((item) => (item.id === equipment.id ? equipment : item)));
      toast.success('Equipment updated successfully');
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast.error('Failed to update equipment');
    }
  };

  const handleAddInternetSpeed = async (speed: Omit<InternetSpeed, 'id'>) => {
    try {
      // Validate required fields
      if (!speed.mbps || !speed.description || speed.price === undefined) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate numeric fields
      if (isNaN(speed.mbps) || isNaN(speed.price) || speed.mbps <= 0 || speed.price < 0) {
        toast.error('Mbps and price must be valid numbers');
        return;
      }

      await addInternetSpeed(speed);
      await fetchAllSettings();
      toast.success('Internet speed added successfully');
    } catch (error) {
      console.error('Error adding internet speed:', error);
      toast.error('Failed to add internet speed');
    }
  };

  const handleUpdateInternetSpeed = async (speed: InternetSpeed) => {
    try {
      // Validate required fields
      if (!speed.mbps || !speed.description || speed.price === undefined) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate numeric fields
      if (isNaN(speed.mbps) || isNaN(speed.price) || speed.mbps <= 0 || speed.price < 0) {
        toast.error('Mbps and price must be valid numbers');
        return;
      }

      await updateInternetSpeed([speed]);
      setSpeeds((prev) => prev.map((item) => (item.id === speed.id ? speed : item)));
      toast.success('Internet speed updated successfully');
    } catch (error) {
      console.error('Error updating internet speed:', error);
      toast.error('Failed to update internet speed');
    }
  };

  const handleUpdateMarkupSettings = async (settings: MarkupSettings) => {
    try {
      await updateMarkupSettings(settings);
      setMarkupSettings(settings);
      toast.success('Markup settings updated successfully');
    } catch (error) {
      console.error('Error updating markup settings:', error);
      toast.error('Failed to update markup settings');
    }
  };

  const handleAddSetupCost = async (cost: Omit<SetupCost, 'id'>) => {
    try {
      await addSetupCost(cost);
      await fetchAllSettings();
      toast.success('Setup cost added successfully');
    } catch (error) {
      console.error('Error adding setup cost:', error);
      toast.error('Failed to add setup cost');
    }
  };

  const handleUpdateSetupCost = async (cost: SetupCost) => {
    try {
      await updateSetupCost(cost);
      setSetupCosts((prev) => prev.map((item) => (item.id === cost.id ? cost : item)));
      toast.success('Setup cost updated successfully');
    } catch (error) {
      console.error('Error updating setup cost:', error);
      toast.error('Failed to update setup cost');
    }
  };

  const handleDeleteSetupCost = async (id: string) => {
    try {
      await deleteSetupCost(id);
      setSetupCosts((prev) => prev.filter((item) => item.id !== id));
      toast.success('Setup cost deleted successfully');
    } catch (error) {
      console.error('Error deleting setup cost:', error);
      toast.error('Failed to delete setup cost');
    }
  };

  const handleAddManagedService = async (service: Omit<ManagedService, 'id'>) => {
    try {
      await addManagedService(service);
      await fetchAllSettings();
      toast.success('Managed service added successfully');
    } catch (error) {
      console.error('Error adding managed service:', error);
      toast.error('Failed to add managed service');
    }
  };

  const handleUpdateManagedService = async (service: ManagedService) => {
    try {
      await updateManagedService(service);
      setManagedServices((prev) => prev.map((item) => (item.id === service.id ? service : item)));
      toast.success('Managed service updated successfully');
    } catch (error) {
      console.error('Error updating managed service:', error);
      toast.error('Failed to update managed service');
    }
  };

  const handleDeleteManagedService = async (id: string) => {
    try {
      await deleteManagedService(id);
      setManagedServices((prev) => prev.filter((item) => item.id !== id));
      toast.success('Managed service deleted successfully');
    } catch (error) {
      console.error('Error deleting managed service:', error);
      toast.error('Failed to delete managed service');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout title="ISP Settings">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">ISP Settings</h1>
        <Tabs defaultValue="equipment" className="space-y-4">
          <TabsList>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="speeds">Internet Speeds</TabsTrigger>
            <TabsTrigger value="markup">Markup Settings</TabsTrigger>
            <TabsTrigger value="setup">Setup Costs</TabsTrigger>
            <TabsTrigger value="services">Managed Services</TabsTrigger>
          </TabsList>

          <TabsContent value="equipment">
            <EquipmentManagement
              equipment={equipment}
              onAddEquipment={handleAddEquipment}
              onUpdateEquipment={handleUpdateEquipment}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="speeds">
            <InternetSpeedManagement
              speeds={speeds}
              onAddSpeed={handleAddInternetSpeed}
              onUpdateSpeed={handleUpdateInternetSpeed}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="markup">
            <MarkupSettingsManagement
              settings={markupSettings}
              onUpdateSettings={handleUpdateMarkupSettings}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="setup">
            <SetupCostsManagement
              costs={setupCosts}
              onAddCost={handleAddSetupCost}
              onUpdateCost={handleUpdateSetupCost}
              onDeleteCost={handleDeleteSetupCost}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="services">
            <ManagedServicesManagement
              services={managedServices}
              onAddService={handleAddManagedService}
              onUpdateService={handleUpdateManagedService}
              onDeleteService={handleDeleteManagedService}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ISPSettings;
