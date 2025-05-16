
import { Equipment, InternetSpeed, SetupCost, ManagedService, MarkupSettings } from '@/types/isp';
import { equipment, internetSpeeds, setupCosts, managedServices, markupSettings } from './mockData';
import { generateId } from './utils';

export const getEquipment = (): Promise<Equipment[]> => {
  return Promise.resolve([...equipment]);
};

export const getInternetSpeeds = (): Promise<InternetSpeed[]> => {
  return Promise.resolve([...internetSpeeds]);
};

export const getSetupCosts = (): Promise<SetupCost[]> => {
  return Promise.resolve([...setupCosts]);
};

export const getManagedServices = (): Promise<ManagedService[]> => {
  return Promise.resolve([...managedServices]);
};

export const getMarkupSettings = (): Promise<MarkupSettings> => {
  return Promise.resolve({ ...markupSettings });
};

export const updateMarkupSettings = (newSettings: MarkupSettings): Promise<MarkupSettings> => {
  markupSettings.equipmentMarkup = newSettings.equipmentMarkup;
  markupSettings.mbpsMarkup = newSettings.mbpsMarkup;
  markupSettings.setupMarkup = newSettings.setupMarkup;
  markupSettings.managedServicesMarkup = newSettings.managedServicesMarkup;
  
  return Promise.resolve({ ...markupSettings });
};

export const updateEquipment = (updatedEquipment: Equipment): Promise<Equipment[]> => {
  const index = equipment.findIndex(e => e.id === updatedEquipment.id);
  if (index >= 0) {
    equipment[index] = updatedEquipment;
  } else {
    equipment.push({
      ...updatedEquipment,
      id: generateId()
    });
  }
  return Promise.resolve([...equipment]);
};

export const updateInternetSpeed = (updatedSpeed: InternetSpeed): Promise<InternetSpeed[]> => {
  const index = internetSpeeds.findIndex(s => s.id === updatedSpeed.id);
  if (index >= 0) {
    internetSpeeds[index] = updatedSpeed;
  } else {
    internetSpeeds.push({
      ...updatedSpeed,
      id: generateId()
    });
  }
  return Promise.resolve([...internetSpeeds]);
};
