import { Equipment, InternetSpeed, SetupCost, ManagedService, MarkupSettings, Invoice, InvoiceItem, ServiceSetup } from '@/types/isp';

// Mock data - in a real application, these would come from an API or database
const equipment: Equipment[] = [
  { 
    id: '1', 
    name: 'Router', 
    description: 'High-performance wireless router', 
    price: 120, 
    imageUrl: 'https://placehold.co/200x200?text=Router', 
    quantity: 1,
    inStock: 15
  },
  { 
    id: '2', 
    name: 'Switch', 
    description: '24-port gigabit network switch', 
    price: 180, 
    imageUrl: 'https://placehold.co/200x200?text=Switch', 
    quantity: 1,
    inStock: 8
  },
  { 
    id: '3', 
    name: 'Access Point', 
    description: 'Dual-band wireless access point', 
    price: 90, 
    imageUrl: 'https://placehold.co/200x200?text=AP', 
    quantity: 1,
    inStock: 20
  },
  { 
    id: '4', 
    name: 'Cat6 Cable (1m)', 
    description: 'High-speed ethernet cable', 
    price: 5, 
    imageUrl: 'https://placehold.co/200x200?text=Cable', 
    quantity: 1,
    inStock: 100
  },
  { 
    id: '5', 
    name: 'Fiber Converter', 
    description: 'Fiber to ethernet converter', 
    price: 75, 
    imageUrl: 'https://placehold.co/200x200?text=Fiber', 
    quantity: 1,
    inStock: 12
  }
];

const internetSpeeds: InternetSpeed[] = [
  { id: '1', mbps: 10, price: 50, description: 'Basic browsing and email' },
  { id: '2', mbps: 25, price: 70, description: 'HD streaming and moderate use' },
  { id: '3', mbps: 50, price: 90, description: 'Multiple device streaming' },
  { id: '4', mbps: 100, price: 120, description: 'Heavy streaming and gaming' },
  { id: '5', mbps: 250, price: 150, description: 'Small business or power users' },
  { id: '6', mbps: 500, price: 200, description: 'Medium business with multiple users' },
  { id: '7', mbps: 1000, price: 300, description: 'Large business with high demands' }
];

const setupCosts: SetupCost[] = [
  { id: '1', name: 'Basic Setup', price: 100 },
  { id: '2', name: 'Standard Setup', price: 200 },
  { id: '3', name: 'Complex Setup', price: 400 }
];

const managedServices: ManagedService[] = [
  { id: '1', name: 'Basic Monitoring', price: 50, description: 'Monthly connection check and basic support' },
  { id: '2', name: 'Standard Support', price: 100, description: '24/7 help desk and monthly maintenance' },
  { id: '3', name: 'Premium Support', price: 200, description: 'Priority support, quarterly maintenance and equipment checks' }
];

let markupSettings: MarkupSettings = {
  equipmentMarkup: 25,
  mbpsMarkup: 30,
  setupMarkup: 20,
  managedServicesMarkup: 35
};

// Generate a unique ID for invoices
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
};

// Format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getEquipment = (): Promise<Equipment[]> => {
  return Promise.resolve(equipment);
};

export const getInternetSpeeds = (): Promise<InternetSpeed[]> => {
  return Promise.resolve(internetSpeeds);
};

export const getSetupCosts = (): Promise<SetupCost[]> => {
  return Promise.resolve(setupCosts);
};

export const getManagedServices = (): Promise<ManagedService[]> => {
  return Promise.resolve(managedServices);
};

export const getMarkupSettings = (): Promise<MarkupSettings> => {
  return Promise.resolve(markupSettings);
};

export const updateMarkupSettings = (newSettings: MarkupSettings): Promise<MarkupSettings> => {
  markupSettings = { ...newSettings };
  return Promise.resolve(markupSettings);
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

export const generateInvoice = (serviceSetup: ServiceSetup): Promise<Invoice> => {
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 30);
  
  const items: InvoiceItem[] = [];
  let subtotal = 0;
  
  // Add equipment
  serviceSetup.equipment.forEach(item => {
    const totalPrice = item.equipment.price * item.quantity;
    items.push({
      name: item.equipment.name,
      description: item.equipment.description,
      quantity: item.quantity,
      unitPrice: item.equipment.price,
      total: totalPrice
    });
    subtotal += totalPrice;
  });
  
  // Add internet speed
  items.push({
    name: `${serviceSetup.internetSpeed.mbps} Mbps Internet`,
    description: serviceSetup.internetSpeed.description,
    quantity: 1,
    unitPrice: serviceSetup.internetSpeed.price,
    total: serviceSetup.internetSpeed.price
  });
  subtotal += serviceSetup.internetSpeed.price;
  
  // Add setup cost
  items.push({
    name: serviceSetup.setupCost.name,
    description: 'One-time installation and setup fee',
    quantity: 1,
    unitPrice: serviceSetup.setupCost.price,
    total: serviceSetup.setupCost.price
  });
  subtotal += serviceSetup.setupCost.price;
  
  // Add managed service if selected
  if (serviceSetup.managedService) {
    items.push({
      name: serviceSetup.managedService.name,
      description: serviceSetup.managedService.description,
      quantity: 1,
      unitPrice: serviceSetup.managedService.price,
      total: serviceSetup.managedService.price
    });
    subtotal += serviceSetup.managedService.price;
  }
  
  // Calculate tax (assuming 10%)
  const tax = subtotal * 0.10;
  const total = subtotal + tax;
  
  const invoice: Invoice = {
    id: generateId(),
    customerName: serviceSetup.customerName,
    customerEmail: serviceSetup.customerEmail,
    customerPhone: serviceSetup.customerPhone,
    customerAddress: serviceSetup.customerAddress,
    date: formatDate(today),
    dueDate: formatDate(dueDate),
    items,
    subtotal,
    tax,
    total,
    notes: 'Thank you for your business!',
    type: 'full'
  };
  
  return Promise.resolve(invoice);
};

export const generateSeparateInvoices = (serviceSetup: ServiceSetup): Promise<Invoice[]> => {
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 30);
  
  // Original cost invoice
  const originalItems: InvoiceItem[] = [];
  let originalSubtotal = 0;
  
  // Markup invoice
  const markupItems: InvoiceItem[] = [];
  let markupSubtotal = 0;
  
  // Add equipment
  serviceSetup.equipment.forEach(item => {
    const originalPrice = item.equipment.price;
    const markupPrice = originalPrice * (markupSettings.equipmentMarkup / 100);
    
    originalItems.push({
      name: item.equipment.name,
      description: item.equipment.description,
      quantity: item.quantity,
      unitPrice: originalPrice,
      total: originalPrice * item.quantity
    });
    originalSubtotal += originalPrice * item.quantity;
    
    markupItems.push({
      name: item.equipment.name,
      description: `Markup for ${item.equipment.name}`,
      quantity: item.quantity,
      unitPrice: markupPrice,
      total: markupPrice * item.quantity
    });
    markupSubtotal += markupPrice * item.quantity;
  });
  
  // Add internet speed
  const originalSpeedPrice = serviceSetup.internetSpeed.price;
  const markupSpeedPrice = originalSpeedPrice * (markupSettings.mbpsMarkup / 100);
  
  originalItems.push({
    name: `${serviceSetup.internetSpeed.mbps} Mbps Internet`,
    description: serviceSetup.internetSpeed.description,
    quantity: 1,
    unitPrice: originalSpeedPrice,
    total: originalSpeedPrice
  });
  originalSubtotal += originalSpeedPrice;
  
  markupItems.push({
    name: `${serviceSetup.internetSpeed.mbps} Mbps Internet Markup`,
    description: `Markup for internet service`,
    quantity: 1,
    unitPrice: markupSpeedPrice,
    total: markupSpeedPrice
  });
  markupSubtotal += markupSpeedPrice;
  
  // Add setup cost
  const originalSetupPrice = serviceSetup.setupCost.price;
  const markupSetupPrice = originalSetupPrice * (markupSettings.setupMarkup / 100);
  
  originalItems.push({
    name: serviceSetup.setupCost.name,
    description: 'One-time installation and setup fee',
    quantity: 1,
    unitPrice: originalSetupPrice,
    total: originalSetupPrice
  });
  originalSubtotal += originalSetupPrice;
  
  markupItems.push({
    name: `${serviceSetup.setupCost.name} Markup`,
    description: 'Markup for installation and setup',
    quantity: 1,
    unitPrice: markupSetupPrice,
    total: markupSetupPrice
  });
  markupSubtotal += markupSetupPrice;
  
  // Add managed service if selected
  if (serviceSetup.managedService) {
    const originalManagedPrice = serviceSetup.managedService.price;
    const markupManagedPrice = originalManagedPrice * (markupSettings.managedServicesMarkup / 100);
    
    originalItems.push({
      name: serviceSetup.managedService.name,
      description: serviceSetup.managedService.description,
      quantity: 1,
      unitPrice: originalManagedPrice,
      total: originalManagedPrice
    });
    originalSubtotal += originalManagedPrice;
    
    markupItems.push({
      name: `${serviceSetup.managedService.name} Markup`,
      description: `Markup for managed service`,
      quantity: 1,
      unitPrice: markupManagedPrice,
      total: markupManagedPrice
    });
    markupSubtotal += markupManagedPrice;
  }
  
  // Calculate taxes
  const originalTax = originalSubtotal * 0.10;
  const originalTotal = originalSubtotal + originalTax;
  
  const markupTax = markupSubtotal * 0.10;
  const markupTotal = markupSubtotal + markupTax;
  
  const originalInvoice: Invoice = {
    id: generateId(),
    customerName: serviceSetup.customerName,
    customerEmail: serviceSetup.customerEmail,
    customerPhone: serviceSetup.customerPhone,
    customerAddress: serviceSetup.customerAddress,
    date: formatDate(today),
    dueDate: formatDate(dueDate),
    items: originalItems,
    subtotal: originalSubtotal,
    tax: originalTax,
    total: originalTotal,
    notes: 'Original costs invoice',
    type: 'original'
  };
  
  const markupInvoice: Invoice = {
    id: generateId(),
    customerName: serviceSetup.customerName,
    customerEmail: serviceSetup.customerEmail,
    customerPhone: serviceSetup.customerPhone,
    customerAddress: serviceSetup.customerAddress,
    date: formatDate(today),
    dueDate: formatDate(dueDate),
    items: markupItems,
    subtotal: markupSubtotal,
    tax: markupTax,
    total: markupTotal,
    notes: 'Markup invoice',
    type: 'markup'
  };
  
  return Promise.resolve([originalInvoice, markupInvoice]);
};
