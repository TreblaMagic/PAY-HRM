import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ServiceSetupForm } from '@/components/isp/ServiceSetupForm';
import { InvoicePreview } from '@/components/isp/InvoicePreview';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { 
  Invoice, 
  Equipment, 
  InternetSpeed, 
  SetupCost, 
  ManagedService, 
  ServiceSetup,
  InvoiceItem
} from '@/types/isp';
import { 
  getEquipment, 
  getInternetSpeeds, 
  getSetupCosts, 
  getManagedServices, 
  generateInvoice, 
  generateSeparateInvoices
} from '@/services/isp';
import { getRecentInvoices } from '@/services/isp/invoiceService';
import { supabase } from '@/lib/supabaseClient';

const ISP = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [internetSpeeds, setInternetSpeeds] = useState<InternetSpeed[]>([]);
  const [setupCosts, setSetupCosts] = useState<SetupCost[]>([]);
  const [managedServices, setManagedServices] = useState<ManagedService[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const loadRecentInvoices = async () => {
    try {
      const invoices = await getRecentInvoices(10);
      setRecentInvoices(invoices);
    } catch (error) {
      console.error('Error loading recent invoices:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipData, speedsData, setupData, servicesData] = await Promise.all([
          getEquipment(),
          getInternetSpeeds(),
          getSetupCosts(),
          getManagedServices()
        ]);
        
        setEquipment(equipData);
        setInternetSpeeds(speedsData);
        setSetupCosts(setupData);
        setManagedServices(servicesData);
        await loadRecentInvoices();
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load service data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const handleGenerateInvoice = async (serviceSetup: ServiceSetup) => {
    try {
      // First create a customer record
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: serviceSetup.customerName,
          email: serviceSetup.customerEmail,
          phone: serviceSetup.customerPhone,
          address: serviceSetup.customerAddress
        })
        .select()
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        throw customerError;
      }

      // Format items for invoice
      const items: InvoiceItem[] = [
        // Add equipment items
        ...serviceSetup.equipment.map(eq => ({
          id: eq.equipment.id,
          name: eq.equipment.name,
          description: eq.equipment.description,
          quantity: eq.quantity,
          unitPrice: eq.equipment.price,
          amount: eq.equipment.price * eq.quantity,
          type: 'equipment' as const
        })),
        // Add internet speeds
        ...serviceSetup.internetSpeed.map(speed => ({
          id: speed.id,
          name: `${speed.mbps} Mbps`,
          description: speed.description,
          quantity: 1,
          unitPrice: speed.price,
          amount: speed.price,
          type: 'internet_speed' as const
        })),
        // Add setup cost
        {
          id: serviceSetup.setupCost.id,
          name: serviceSetup.setupCost.name,
          description: serviceSetup.setupCost.description,
          quantity: 1,
          unitPrice: serviceSetup.setupCost.price,
          amount: serviceSetup.setupCost.price,
          type: 'setup_cost' as const
        }
      ];

      // Add managed service if selected
      if (serviceSetup.managedService) {
        items.push({
          id: serviceSetup.managedService.id,
          name: serviceSetup.managedService.name,
          description: serviceSetup.managedService.description,
          quantity: 1,
          unitPrice: serviceSetup.managedService.price,
          amount: serviceSetup.managedService.price,
          type: 'managed_service' as const
        });
      }

      const invoice = await generateInvoice(customerData, items);
      setInvoices([invoice]);
      await loadRecentInvoices(); // Refresh recent invoices
      toast({
        title: "Success",
        description: "Invoice generated successfully",
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleGenerateSeparateInvoices = async (serviceSetup: ServiceSetup) => {
    try {
      // First create a customer record
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: serviceSetup.customerName,
          email: serviceSetup.customerEmail,
          phone: serviceSetup.customerPhone,
          address: serviceSetup.customerAddress
        })
        .select()
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        throw customerError;
      }

      // Format items for invoice
      const items: InvoiceItem[] = [
        // Add equipment items
        ...serviceSetup.equipment.map(eq => ({
          id: eq.equipment.id,
          name: eq.equipment.name,
          description: eq.equipment.description,
          quantity: eq.quantity,
          unitPrice: eq.equipment.price,
          amount: eq.equipment.price * eq.quantity,
          type: 'equipment' as const
        })),
        // Add internet speeds
        ...serviceSetup.internetSpeed.map(speed => ({
          id: speed.id,
          name: `${speed.mbps} Mbps`,
          description: speed.description,
          quantity: 1,
          unitPrice: speed.price,
          amount: speed.price,
          type: 'internet_speed' as const
        })),
        // Add setup cost
        {
          id: serviceSetup.setupCost.id,
          name: serviceSetup.setupCost.name,
          description: serviceSetup.setupCost.description,
          quantity: 1,
          unitPrice: serviceSetup.setupCost.price,
          amount: serviceSetup.setupCost.price,
          type: 'setup_cost' as const
        }
      ];

      // Add managed service if selected
      if (serviceSetup.managedService) {
        items.push({
          id: serviceSetup.managedService.id,
          name: serviceSetup.managedService.name,
          description: serviceSetup.managedService.description,
          quantity: 1,
          unitPrice: serviceSetup.managedService.price,
          amount: serviceSetup.managedService.price,
          type: 'managed_service' as const
        });
      }

      const generatedInvoices = await generateSeparateInvoices(customerData, items);
      setInvoices([generatedInvoices.baseInvoice, generatedInvoices.markupInvoice]);
      await loadRecentInvoices(); // Refresh recent invoices
      toast({
        title: "Success",
        description: "Separate invoices generated successfully",
      });
    } catch (error) {
      console.error('Error generating separate invoices:', error);
      toast({
        title: "Error",
        description: "Failed to generate separate invoices. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCloseInvoice = async () => {
    setInvoices([]);
    await loadRecentInvoices(); // Refresh recent invoices when closing preview
  };

  const handleInvoiceUpdate = async () => {
    // Refresh the currently displayed invoices if they exist
    if (invoices.length > 0) {
      try {
        const updatedInvoices = await Promise.all(
          invoices.map(async (invoice) => {
            const recent = await getRecentInvoices(100);
            return recent.find(inv => inv.id === invoice.id) || invoice;
          })
        );
        setInvoices(updatedInvoices.filter(Boolean) as Invoice[]);
      } catch (error) {
        console.error('Error refreshing invoices:', error);
      }
    }
    await loadRecentInvoices(); // Also refresh the recent invoices list
  };
  
  const goToSettings = () => {
    navigate('/isp/settings');
  };
  
  if (loading) {
    return (
      <DashboardLayout title="ISP Services" activePage="dashboard">
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="ISP Services" activePage="dashboard">
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Service Management</h1>
            <p className="text-gray-500">Create and manage ISP service packages and invoices</p>
          </div>
          <Button onClick={goToSettings} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
        
        {invoices.length > 0 ? (
          <InvoicePreview 
            invoices={invoices} 
            onClose={handleCloseInvoice}
            onInvoiceUpdate={handleInvoiceUpdate}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8">
            <ServiceSetupForm
              equipment={equipment}
              internetSpeeds={internetSpeeds}
              setupCosts={setupCosts}
              managedServices={managedServices}
              onGenerateInvoice={handleGenerateInvoice}
              onGenerateSeparateInvoices={handleGenerateSeparateInvoices}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>View and manage your recently created invoices</CardDescription>
              </CardHeader>
              <CardContent>
                {recentInvoices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No recent invoices. Create a new invoice using the form above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setInvoices([invoice])}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{invoice.customerName}</div>
                            <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(invoice.date).toLocaleDateString()} • {invoice.type}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(invoice.total)}</div>
                            <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : invoice.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {invoice.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ISP;
