export interface Equipment {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface InternetSpeed {
  id: string;
  mbps: number;
  price: number;
  description: string;
}

export interface MarkupSettings {
  equipmentMarkup: number;
  mbpsMarkup: number;
  setupMarkup: number;
  managedServicesMarkup: number;
}

export interface SetupCost {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface ManagedService {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: 'equipment' | 'internet_speed' | 'setup_cost' | 'managed_service';
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  type: 'base' | 'markup' | 'full';
  date: string;
  dueDate: string;
  notes?: string;
}

export interface ServiceSetup {
  equipment: { equipment: Equipment; quantity: number }[];
  internetSpeed: InternetSpeed[];
  setupCost: SetupCost;
  managedService?: ManagedService;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
}
