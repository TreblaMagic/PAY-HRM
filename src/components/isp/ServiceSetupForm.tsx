
import { useState } from "react";
import { Equipment, InternetSpeed, SetupCost, ManagedService, ServiceSetup } from "@/types/isp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, Trash2 } from "lucide-react";

interface ServiceSetupFormProps {
  equipment: Equipment[];
  internetSpeeds: InternetSpeed[];
  setupCosts: SetupCost[];
  managedServices: ManagedService[];
  onGenerateInvoice: (serviceSetup: ServiceSetup) => void;
  onGenerateSeparateInvoices: (serviceSetup: ServiceSetup) => void;
}

export const ServiceSetupForm = ({
  equipment,
  internetSpeeds,
  setupCosts,
  managedServices,
  onGenerateInvoice,
  onGenerateSeparateInvoices
}: ServiceSetupFormProps) => {
  const [selectedEquipment, setSelectedEquipment] = useState<{ equipment: Equipment; quantity: number }[]>([]);
  const [selectedSpeed, setSelectedSpeed] = useState<InternetSpeed | null>(null);
  const [selectedSetup, setSelectedSetup] = useState<SetupCost | null>(null);
  const [selectedService, setSelectedService] = useState<ManagedService | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  
  const handleAddEquipment = (equipmentId: string) => {
    const equip = equipment.find(e => e.id === equipmentId);
    if (equip) {
      setSelectedEquipment(prev => [
        ...prev, 
        { equipment: equip, quantity: 1 }
      ]);
    }
  };

  const handleRemoveEquipment = (index: number) => {
    setSelectedEquipment(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedEquipment = [...selectedEquipment];
    updatedEquipment[index].quantity = newQuantity;
    setSelectedEquipment(updatedEquipment);
  };

  const handleSpeedChange = (speedId: string) => {
    const speed = internetSpeeds.find(s => s.id === speedId);
    if (speed) setSelectedSpeed(speed);
  };

  const handleSetupChange = (setupId: string) => {
    const setup = setupCosts.find(s => s.id === setupId);
    if (setup) setSelectedSetup(setup);
  };

  const handleServiceChange = (serviceId: string) => {
    if (serviceId === "") {
      setSelectedService(null);
      return;
    }
    
    const service = managedServices.find(s => s.id === serviceId);
    if (service) setSelectedService(service);
  };

  const handleGenerateInvoice = () => {
    if (!selectedSpeed || !selectedSetup || !customerName) return;
    
    const serviceSetup: ServiceSetup = {
      equipment: selectedEquipment,
      internetSpeed: selectedSpeed,
      setupCost: selectedSetup,
      managedService: selectedService || undefined,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress
    };
    
    onGenerateInvoice(serviceSetup);
  };

  const handleGenerateSeparateInvoices = () => {
    if (!selectedSpeed || !selectedSetup || !customerName) return;
    
    const serviceSetup: ServiceSetup = {
      equipment: selectedEquipment,
      internetSpeed: selectedSpeed,
      setupCost: selectedSetup,
      managedService: selectedService || undefined,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress
    };
    
    onGenerateSeparateInvoices(serviceSetup);
  };

  const isFormValid = selectedEquipment.length > 0 && 
                      selectedSpeed !== null && 
                      selectedSetup !== null && 
                      customerName.trim() !== "" && 
                      customerEmail.trim() !== "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input 
              id="customerName" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Customer Email</Label>
            <Input 
              id="customerEmail" 
              type="email" 
              value={customerEmail} 
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter customer email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Customer Phone</Label>
            <Input 
              id="customerPhone" 
              value={customerPhone} 
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter customer phone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerAddress">Customer Address</Label>
            <Input 
              id="customerAddress" 
              value={customerAddress} 
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Enter customer address"
            />
          </div>
        </div>
        
        {/* Equipment Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Equipment</Label>
            <Select onValueChange={handleAddEquipment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Add Equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} (${item.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedEquipment.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No equipment selected. Add equipment from the dropdown above.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedEquipment.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.equipment.imageUrl} 
                      alt={item.equipment.name} 
                      className="h-10 w-10 object-cover rounded" 
                    />
                    <div>
                      <p className="font-medium">{item.equipment.name}</p>
                      <p className="text-xs text-gray-500">${item.equipment.price} each</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleQuantityChange(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)} 
                        className="w-14 text-center mx-1"
                        min={1}
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleQuantityChange(index, item.quantity + 1)}
                        disabled={item.quantity >= (item.equipment.inStock || 999)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveEquipment(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Internet Speed */}
        <div className="space-y-2">
          <Label htmlFor="internetSpeed">Internet Speed</Label>
          <Select onValueChange={handleSpeedChange}>
            <SelectTrigger id="internetSpeed">
              <SelectValue placeholder="Select Internet Speed" />
            </SelectTrigger>
            <SelectContent>
              {internetSpeeds.map((speed) => (
                <SelectItem key={speed.id} value={speed.id}>
                  {speed.mbps} Mbps - ${speed.price} ({speed.description})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Setup Cost */}
        <div className="space-y-2">
          <Label htmlFor="setupCost">Setup Cost</Label>
          <Select onValueChange={handleSetupChange}>
            <SelectTrigger id="setupCost">
              <SelectValue placeholder="Select Setup Package" />
            </SelectTrigger>
            <SelectContent>
              {setupCosts.map((setup) => (
                <SelectItem key={setup.id} value={setup.id}>
                  {setup.name} - ${setup.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Managed Service */}
        <div className="space-y-2">
          <Label htmlFor="managedService">Managed Service (Optional)</Label>
          <Select onValueChange={handleServiceChange}>
            <SelectTrigger id="managedService">
              <SelectValue placeholder="Select Managed Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {managedServices.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - ${service.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleGenerateInvoice} 
            disabled={!isFormValid}
            className="flex-1"
          >
            Generate Full Invoice
          </Button>
          <Button 
            onClick={handleGenerateSeparateInvoices}
            disabled={!isFormValid}
            variant="outline"
            className="flex-1"
          >
            Generate Separate Invoices
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
