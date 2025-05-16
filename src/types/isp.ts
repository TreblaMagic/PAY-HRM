
export type Equipment = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  inStock: number;
};

export type InternetSpeed = {
  id: string;
  mbps: number;
  price: number;
  description: string;
};

export type SetupCost = {
  id: string;
  name: string;
  price: number;
};

export type ManagedService = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type MarkupSettings = {
  equipmentMarkup: number;
  mbpsMarkup: number;
  setupMarkup: number;
  managedServicesMarkup: number;
};

export type InvoiceItem = {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  type: 'full' | 'original' | 'markup';
};

export type ServiceSetup = {
  equipment: { equipment: Equipment; quantity: number }[];
  internetSpeed: InternetSpeed;
  setupCost: SetupCost;
  managedService?: ManagedService;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
};
