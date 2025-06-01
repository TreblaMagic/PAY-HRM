import { supabase } from "@/lib/supabaseClient";
import { Equipment, InternetSpeed, MarkupSettings, SetupCost, ManagedService } from "@/types/isp";

// Initialize default settings if they don't exist
const initializeSettings = async () => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('id');

  if (error) {
    console.error('Error checking settings:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    // No settings exist, create default settings
    const { error: insertError } = await supabase
      .from('isp_settings')
      .insert([{
        equipment: [],
        internet_speeds: [],
        setup_costs: [],
        managed_services: [],
        markup_settings: {
          equipmentMarkup: 25,
          mbpsMarkup: 30,
          setupMarkup: 20,
          managedServicesMarkup: 35
        }
      }]);

    if (insertError) {
      console.error('Error initializing settings:', insertError);
      throw insertError;
    }
  }
};

// Get equipment settings
export const getEquipment = async (): Promise<Equipment[]> => {
  await initializeSettings();
  
  const { data, error } = await supabase
    .from('isp_settings')
    .select('equipment')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching equipment settings:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data[0].equipment as unknown) as Equipment[];
};

// Get internet speeds
export const getInternetSpeeds = async (): Promise<InternetSpeed[]> => {
  await initializeSettings();
  
  const { data, error } = await supabase
    .from('isp_settings')
    .select('internet_speeds')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching internet speeds:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data[0].internet_speeds as unknown) as InternetSpeed[];
};

// Get markup settings
export const getMarkupSettings = async (): Promise<MarkupSettings> => {
  await initializeSettings();
  
  const { data, error } = await supabase
    .from('isp_settings')
    .select('markup_settings')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching markup settings:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      equipmentMarkup: 25,
      mbpsMarkup: 30,
      setupMarkup: 20,
      managedServicesMarkup: 35
    };
  }

  return (data[0].markup_settings as unknown) as MarkupSettings;
};

// Get setup costs
export const getSetupCosts = async (): Promise<SetupCost[]> => {
  await initializeSettings();
  
  const { data, error } = await supabase
    .from('isp_settings')
    .select('setup_costs')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching setup costs:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data[0].setup_costs as unknown) as SetupCost[];
};

// Get managed services
export const getManagedServices = async (): Promise<ManagedService[]> => {
  await initializeSettings();
  
  const { data, error } = await supabase
    .from('isp_settings')
    .select('managed_services')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching managed services:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data[0].managed_services as unknown) as ManagedService[];
};

// Update equipment
export const updateEquipment = async (equipment: Equipment[]): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching settings id:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ equipment: equipment as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error updating equipment:', updateError);
    throw updateError;
  }
};

// Update internet speeds
export const updateInternetSpeed = async (speeds: InternetSpeed[]): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching settings id:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ internet_speeds: speeds as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error updating internet speeds:', updateError);
    throw updateError;
  }
};

// Update markup settings
export const updateMarkupSettings = async (settings: MarkupSettings): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching settings id:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ markup_settings: settings as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error updating markup settings:', updateError);
    throw updateError;
  }
};

// Add setup cost
export const addSetupCost = async (cost: Omit<SetupCost, 'id'>): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('setup_costs, id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching setup costs:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const costs = (data[0].setup_costs as unknown) as SetupCost[];
  const newCost = {
    ...cost,
    id: crypto.randomUUID()
  };

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ setup_costs: [...costs, newCost] as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error adding setup cost:', updateError);
    throw updateError;
  }
};

// Update setup cost
export const updateSetupCost = async (cost: SetupCost): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('setup_costs, id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching setup costs:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const costs = (data[0].setup_costs as unknown) as SetupCost[];
  const updatedCosts = costs.map(c => c.id === cost.id ? cost : c);

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ setup_costs: updatedCosts as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error updating setup cost:', updateError);
    throw updateError;
  }
};

// Delete setup cost
export const deleteSetupCost = async (id: string): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('setup_costs, id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching setup costs:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const costs = (data[0].setup_costs as unknown) as SetupCost[];
  const updatedCosts = costs.filter(c => c.id !== id);

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ setup_costs: updatedCosts as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error deleting setup cost:', updateError);
    throw updateError;
  }
};

// Add managed service
export const addManagedService = async (service: Omit<ManagedService, 'id'>): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('managed_services, id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching managed services:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const services = (data[0].managed_services as unknown) as ManagedService[];
  const newService = {
    ...service,
    id: crypto.randomUUID()
  };

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ managed_services: [...services, newService] as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error adding managed service:', updateError);
    throw updateError;
  }
};

// Update managed service
export const updateManagedService = async (service: ManagedService): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('managed_services, id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching managed services:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const services = (data[0].managed_services as unknown) as ManagedService[];
  const updatedServices = services.map(s => s.id === service.id ? service : s);

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ managed_services: updatedServices as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error updating managed service:', updateError);
    throw updateError;
  }
};

// Delete managed service
export const deleteManagedService = async (id: string): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('managed_services, id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching managed services:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const services = (data[0].managed_services as unknown) as ManagedService[];
  const updatedServices = services.filter(s => s.id !== id);

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ managed_services: updatedServices as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error deleting managed service:', updateError);
    throw updateError;
  }
};

// Add equipment
export const addEquipment = async (equipment: Omit<Equipment, 'id'>): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('equipment, id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const equipmentList = (data[0].equipment as unknown) as Equipment[];
  const newEquipment = {
    ...equipment,
    id: crypto.randomUUID()
  };

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ equipment: [...equipmentList, newEquipment] as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error adding equipment:', updateError);
    throw updateError;
  }
};

// Add internet speed
export const addInternetSpeed = async (speed: Omit<InternetSpeed, 'id'>): Promise<void> => {
  const { data, error } = await supabase
    .from('isp_settings')
    .select('internet_speeds, id')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching internet speeds:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No settings found to update');
  }

  const speeds = (data[0].internet_speeds as unknown) as InternetSpeed[];
  const newSpeed = {
    ...speed,
    id: crypto.randomUUID()
  };

  const { error: updateError } = await supabase
    .from('isp_settings')
    .update({ internet_speeds: [...speeds, newSpeed] as unknown as any })
    .eq('id', data[0].id);

  if (updateError) {
    console.error('Error adding internet speed:', updateError);
    throw updateError;
  }
};
