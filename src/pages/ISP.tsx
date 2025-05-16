import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ServiceSetupForm } from '@/components/isp/ServiceSetupForm';
import { InvoicePreview } from '@/components/isp/InvoicePreview';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Invoice, 
  Equipment, 
  InternetSpeed, 
  SetupCost, 
  ManagedService, 
  ServiceSetup 
} from '@/types/isp';
import { 
  getEquipment, 
  getInternetSpeeds, 
  getSetupCosts, 
  getManagedServices, 
  generateInvoice, 
  generateSeparateInvoices
} from '@/services/isp';

const ISP = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [internetSpeeds, setInternetSpeeds] = useState<InternetSpeed[]>([]);
  const [setupCosts, setSetupCosts] = useState<SetupCost[]>([]);
  const [managedServices, setManagedServices] = useState<ManagedService[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
      const invoice = await generateInvoice(serviceSetup);
      setInvoices([invoice]);
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
      const generatedInvoices = await generateSeparateInvoices(serviceSetup);
      setInvoices(generatedInvoices);
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
  
  const handleCloseInvoice = () => {
    setInvoices([]);
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
          <InvoicePreview invoices={invoices} onClose={handleCloseInvoice} />
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
                <div className="text-center py-8 text-gray-500">
                  No recent invoices. Create a new invoice using the form above.
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ISP;
