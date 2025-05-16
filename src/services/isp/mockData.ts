
import { Equipment, InternetSpeed, SetupCost, ManagedService, MarkupSettings } from '@/types/isp';

// Mock data - in a real application, these would come from an API or database
export const equipment: Equipment[] = [
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

export const internetSpeeds: InternetSpeed[] = [
  { id: '1', mbps: 10, price: 50, description: 'Basic browsing and email' },
  { id: '2', mbps: 25, price: 70, description: 'HD streaming and moderate use' },
  { id: '3', mbps: 50, price: 90, description: 'Multiple device streaming' },
  { id: '4', mbps: 100, price: 120, description: 'Heavy streaming and gaming' },
  { id: '5', mbps: 250, price: 150, description: 'Small business or power users' },
  { id: '6', mbps: 500, price: 200, description: 'Medium business with multiple users' },
  { id: '7', mbps: 1000, price: 300, description: 'Large business with high demands' }
];

export const setupCosts: SetupCost[] = [
  { id: '1', name: 'Basic Setup', price: 100 },
  { id: '2', name: 'Standard Setup', price: 200 },
  { id: '3', name: 'Complex Setup', price: 400 }
];

export const managedServices: ManagedService[] = [
  { id: '1', name: 'Basic Monitoring', price: 50, description: 'Monthly connection check and basic support' },
  { id: '2', name: 'Standard Support', price: 100, description: '24/7 help desk and monthly maintenance' },
  { id: '3', name: 'Premium Support', price: 200, description: 'Priority support, quarterly maintenance and equipment checks' }
];

export let markupSettings: MarkupSettings = {
  equipmentMarkup: 25,
  mbpsMarkup: 30,
  setupMarkup: 20,
  managedServicesMarkup: 35
};
