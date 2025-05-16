
import { Invoice, InvoiceItem, ServiceSetup } from '@/types/isp';
import { markupSettings } from './mockData';
import { generateId, formatDate } from './utils';

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
