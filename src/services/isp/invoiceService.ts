import { Invoice, InvoiceItem, ServiceSetup } from '@/types/isp';
import { markupSettings } from './mockData';
import { generateId, formatDate } from './utils';
import { supabase } from '@/lib/supabaseClient';
import { Equipment, InternetSpeed, MarkupSettings, SetupCost, ManagedService } from '@/types/isp';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

export const generateInvoice = async (customerData: CustomerData, items: InvoiceItem[]): Promise<Invoice> => {
  try {
    // Get markup settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('isp_markup_settings')
      .select('*')
      .order('id', { ascending: true })
      .limit(1);

    if (settingsError) {
      console.error('Error fetching markup settings:', settingsError);
      throw settingsError;
    }

    if (!settingsData || settingsData.length === 0) {
      throw new Error('No markup settings found');
    }

    const markupSettings = {
      equipmentMarkup: settingsData[0].equipment_markup,
      mbpsMarkup: settingsData[0].mbps_markup,
      setupMarkup: settingsData[0].setup_markup,
      managedServicesMarkup: settingsData[0].managed_services_markup
    };

    // Calculate prices with markup
    const itemsWithMarkup = items.map(item => {
      let originalPrice = item.unitPrice;
      let markupAmount = 0;

      switch (item.type) {
        case 'equipment':
          markupAmount = originalPrice * (markupSettings.equipmentMarkup / 100);
          break;
        case 'internet_speed':
          markupAmount = originalPrice * (markupSettings.mbpsMarkup / 100);
          break;
        case 'setup_cost':
          markupAmount = originalPrice * (markupSettings.setupMarkup / 100);
          break;
        case 'managed_service':
          markupAmount = originalPrice * (markupSettings.managedServicesMarkup / 100);
          break;
      }

      return {
        ...item,
        unitPrice: originalPrice + markupAmount,
        amount: (originalPrice + markupAmount) * item.quantity
      };
    });

    // Calculate totals
    const subtotal = itemsWithMarkup.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    // Create invoice
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      customerId: customerData.id,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone || '',
      customerAddress: customerData.address || '',
      items: itemsWithMarkup,
      subtotal,
      tax,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'full',
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      notes: 'Thank you for your business!'
    };

    // Save to database
    const { error: insertError } = await supabase
      .from('invoices')
      .insert({
        id: invoice.id,
        customer_id: invoice.customerId,
        customer_name: invoice.customerName,
        customer_email: invoice.customerEmail,
        customer_phone: invoice.customerPhone,
        customer_address: invoice.customerAddress,
        items: invoice.items,
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total,
        status: invoice.status,
        type: invoice.type,
        created_at: invoice.createdAt,
        updated_at: invoice.updatedAt,
        date: invoice.date,
        due_date: invoice.dueDate,
        notes: invoice.notes
      });

    if (insertError) {
      console.error('Error creating invoice:', insertError);
      throw insertError;
    }

    return invoice;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

export const generateSeparateInvoices = async (customerData: CustomerData, items: InvoiceItem[]): Promise<{ baseInvoice: Invoice; markupInvoice: Invoice }> => {
  try {
    // Get markup settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('isp_markup_settings')
      .select('*')
      .order('id', { ascending: true })
      .limit(1);

    if (settingsError) {
      console.error('Error fetching markup settings:', settingsError);
      throw settingsError;
    }

    if (!settingsData || settingsData.length === 0) {
      throw new Error('No markup settings found');
    }

    const markupSettings = {
      equipmentMarkup: settingsData[0].equipment_markup,
      mbpsMarkup: settingsData[0].mbps_markup,
      setupMarkup: settingsData[0].setup_markup,
      managedServicesMarkup: settingsData[0].managed_services_markup
    };

    // Calculate base prices and markup amounts
    const baseItems = items.map(item => ({
      ...item,
      unitPrice: item.unitPrice,
      amount: item.unitPrice * item.quantity
    }));

    const markupItems = items.map(item => {
      let markupAmount = 0;

      switch (item.type) {
        case 'equipment':
          markupAmount = item.unitPrice * (markupSettings.equipmentMarkup / 100);
          break;
        case 'internet_speed':
          markupAmount = item.unitPrice * (markupSettings.mbpsMarkup / 100);
          break;
        case 'setup_cost':
          markupAmount = item.unitPrice * (markupSettings.setupMarkup / 100);
          break;
        case 'managed_service':
          markupAmount = item.unitPrice * (markupSettings.managedServicesMarkup / 100);
          break;
      }

      return {
        ...item,
        unitPrice: markupAmount,
        amount: markupAmount * item.quantity
      };
    });

    // Calculate totals for base invoice
    const baseSubtotal = baseItems.reduce((sum, item) => sum + item.amount, 0);
    const baseTax = baseSubtotal * 0.05; // 5% tax
    const baseTotal = baseSubtotal + baseTax;

    // Calculate totals for markup invoice
    const markupSubtotal = markupItems.reduce((sum, item) => sum + item.amount, 0);
    const markupTax = markupSubtotal * 0.05; // 5% tax
    const markupTotal = markupSubtotal + markupTax;

    // Create base invoice
    const baseInvoice: Invoice = {
      id: crypto.randomUUID(),
      customerId: customerData.id,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone || '',
      customerAddress: customerData.address || '',
      items: baseItems,
      subtotal: baseSubtotal,
      tax: baseTax,
      total: baseTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'base',
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      notes: 'Base costs invoice'
    };

    // Create markup invoice
    const markupInvoice: Invoice = {
      id: crypto.randomUUID(),
      customerId: customerData.id,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone || '',
      customerAddress: customerData.address || '',
      items: markupItems,
      subtotal: markupSubtotal,
      tax: markupTax,
      total: markupTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'markup',
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      notes: 'Markup costs invoice'
    };

    // Save to database
    const { error: insertError } = await supabase
      .from('invoices')
      .insert([
        {
          id: baseInvoice.id,
          customer_id: baseInvoice.customerId,
          customer_name: baseInvoice.customerName,
          customer_email: baseInvoice.customerEmail,
          customer_phone: baseInvoice.customerPhone,
          customer_address: baseInvoice.customerAddress,
          items: baseInvoice.items,
          subtotal: baseInvoice.subtotal,
          tax: baseInvoice.tax,
          total: baseInvoice.total,
          status: baseInvoice.status,
          type: baseInvoice.type,
          created_at: baseInvoice.createdAt,
          updated_at: baseInvoice.updatedAt,
          date: baseInvoice.date,
          due_date: baseInvoice.dueDate,
          notes: baseInvoice.notes
        },
        {
          id: markupInvoice.id,
          customer_id: markupInvoice.customerId,
          customer_name: markupInvoice.customerName,
          customer_email: markupInvoice.customerEmail,
          customer_phone: markupInvoice.customerPhone,
          customer_address: markupInvoice.customerAddress,
          items: markupInvoice.items,
          subtotal: markupInvoice.subtotal,
          tax: markupInvoice.tax,
          total: markupInvoice.total,
          status: markupInvoice.status,
          type: markupInvoice.type,
          created_at: markupInvoice.createdAt,
          updated_at: markupInvoice.updatedAt,
          date: markupInvoice.date,
          due_date: markupInvoice.dueDate,
          notes: markupInvoice.notes
        }
      ]);

    if (insertError) {
      console.error('Error creating separate invoices:', insertError);
      throw insertError;
    }

    return { baseInvoice, markupInvoice };
  } catch (error) {
    console.error('Error generating separate invoices:', error);
    throw error;
  }
};

// Helper to convert database snake_case to application camelCase for Invoice
const toCamelCaseInvoice = (data: any): Invoice => ({
  id: data.id,
  customerId: data.customer_id,
  customerName: data.customer_name,
  customerEmail: data.customer_email,
  customerPhone: data.customer_phone || '',
  customerAddress: data.customer_address || '',
  items: data.items || [],
  subtotal: parseFloat(data.subtotal),
  tax: parseFloat(data.tax),
  total: parseFloat(data.total),
  status: data.status,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  type: data.type,
  date: data.date,
  dueDate: data.due_date,
  notes: data.notes || undefined,
});

// Get recent invoices
export const getRecentInvoices = async (limit: number = 10): Promise<Invoice[]> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent invoices:', error);
      throw error;
    }

    return (data || []).map(toCamelCaseInvoice);
  } catch (error) {
    console.error('Error getting recent invoices:', error);
    throw error;
  }
};

// Update invoice status
export const updateInvoiceStatus = async (invoiceId: string, status: 'pending' | 'paid' | 'cancelled'): Promise<Invoice> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }

    return toCamelCaseInvoice(data);
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
};