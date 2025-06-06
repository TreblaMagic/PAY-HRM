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

// Get equipment
export const getEquipment = async (): Promise<Equipment[]> => {
  const { data, error } = await supabase
    .from('isp_equipment')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    stock: item.stock
  }));
};

// Get internet speeds
export const getInternetSpeeds = async (): Promise<InternetSpeed[]> => {
  const { data, error } = await supabase
    .from('isp_internet_speeds')
    .select('*')
    .order('mbps');

  if (error) {
    console.error('Error fetching internet speeds:', error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    mbps: item.mbps,
    description: item.description,
    price: item.price
  }));
};

// Get markup settings
export const getMarkupSettings = async (): Promise<MarkupSettings> => {
  const { data, error } = await supabase
    .from('isp_markup_settings')
    .select('*')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching markup settings:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    // Create default settings if none exist
    const { data: newData, error: insertError } = await supabase
      .from('isp_markup_settings')
      .insert([{
        equipment_markup: 25,
        mbps_markup: 30,
        setup_markup: 20,
        managed_services_markup: 35
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating default markup settings:', insertError);
      throw insertError;
    }

    return {
      equipmentMarkup: newData.equipment_markup,
      mbpsMarkup: newData.mbps_markup,
      setupMarkup: newData.setup_markup,
      managedServicesMarkup: newData.managed_services_markup
    };
  }

  return {
    equipmentMarkup: data[0].equipment_markup,
    mbpsMarkup: data[0].mbps_markup,
    setupMarkup: data[0].setup_markup,
    managedServicesMarkup: data[0].managed_services_markup
  };
};

// Get setup costs
export const getSetupCosts = async (): Promise<SetupCost[]> => {
  const { data, error } = await supabase
    .from('isp_setup_costs')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching setup costs:', error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price
  }));
};

// Get managed services
export const getManagedServices = async (): Promise<ManagedService[]> => {
  const { data, error } = await supabase
    .from('isp_managed_services')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching managed services:', error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price
  }));
};

// Update equipment
export const updateEquipment = async (equipment: Equipment[]): Promise<void> => {
  const { error } = await supabase
    .from('isp_equipment')
    .upsert(equipment.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock
    })));

  if (error) {
    console.error('Error updating equipment:', error);
    throw error;
  }
};

// Update internet speed
export const updateInternetSpeed = async (speeds: InternetSpeed[]): Promise<void> => {
  const { error } = await supabase
    .from('isp_internet_speeds')
    .upsert(speeds.map(item => ({
      id: item.id,
      mbps: item.mbps,
      description: item.description,
      price: item.price
    })));

  if (error) {
    console.error('Error updating internet speeds:', error);
    throw error;
  }
};

// Update markup settings
export const updateMarkupSettings = async (settings: MarkupSettings): Promise<void> => {
  const { data, error: fetchError } = await supabase
    .from('isp_markup_settings')
    .select('id')
    .limit(1);

  if (fetchError) {
    console.error('Error fetching markup settings:', fetchError);
    throw fetchError;
  }

  if (!data || data.length === 0) {
    // Create new settings if none exist
    const { error: insertError } = await supabase
      .from('isp_markup_settings')
      .insert([{
        equipment_markup: settings.equipmentMarkup,
        mbps_markup: settings.mbpsMarkup,
        setup_markup: settings.setupMarkup,
        managed_services_markup: settings.managedServicesMarkup
      }]);

    if (insertError) {
      console.error('Error creating markup settings:', insertError);
      throw insertError;
    }
  } else {
    // Update existing settings
    const { error: updateError } = await supabase
      .from('isp_markup_settings')
      .update({
        equipment_markup: settings.equipmentMarkup,
        mbps_markup: settings.mbpsMarkup,
        setup_markup: settings.setupMarkup,
        managed_services_markup: settings.managedServicesMarkup
      })
      .eq('id', data[0].id);

    if (updateError) {
      console.error('Error updating markup settings:', updateError);
      throw updateError;
    }
  }
};

// Add setup cost
export const addSetupCost = async (cost: Omit<SetupCost, 'id'>): Promise<SetupCost> => {
  const { data, error } = await supabase
    .from('isp_setup_costs')
    .insert([{
      name: cost.name,
      description: cost.description,
      price: cost.price
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding setup cost:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price
  };
};

// Update setup cost
export const updateSetupCost = async (cost: SetupCost): Promise<void> => {
  const { error } = await supabase
    .from('isp_setup_costs')
    .update({
      name: cost.name,
      description: cost.description,
      price: cost.price
    })
    .eq('id', cost.id);

  if (error) {
    console.error('Error updating setup cost:', error);
    throw error;
  }
};

// Delete setup cost
export const deleteSetupCost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('isp_setup_costs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting setup cost:', error);
    throw error;
  }
};

// Add managed service
export const addManagedService = async (service: Omit<ManagedService, 'id'>): Promise<ManagedService> => {
  const { data, error } = await supabase
    .from('isp_managed_services')
    .insert([{
      name: service.name,
      description: service.description,
      price: service.price
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding managed service:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price
  };
};

// Update managed service
export const updateManagedService = async (service: ManagedService): Promise<void> => {
  const { error } = await supabase
    .from('isp_managed_services')
    .update({
      name: service.name,
      description: service.description,
      price: service.price
    })
    .eq('id', service.id);

  if (error) {
    console.error('Error updating managed service:', error);
    throw error;
  }
};

// Delete managed service
export const deleteManagedService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('isp_managed_services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting managed service:', error);
    throw error;
  }
};

// Add equipment
export const addEquipment = async (equipment: Omit<Equipment, 'id'>): Promise<Equipment> => {
  const { data, error } = await supabase
    .from('isp_equipment')
    .insert([{
      name: equipment.name,
      description: equipment.description,
      price: equipment.price,
      stock: equipment.stock
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding equipment:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock
  };
};

// Add internet speed
export const addInternetSpeed = async (speed: Omit<InternetSpeed, 'id'>): Promise<InternetSpeed> => {
  const { data, error } = await supabase
    .from('isp_internet_speeds')
    .insert([{
      mbps: speed.mbps,
      description: speed.description,
      price: speed.price
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding internet speed:', error);
    throw error;
  }

  return {
    id: data.id,
    mbps: data.mbps,
    description: data.description,
    price: data.price
  };
};
