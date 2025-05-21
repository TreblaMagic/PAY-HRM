import { useState } from "react";
import { Invoice } from "@/types/isp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Printer } from "lucide-react";

interface InvoicePreviewProps {
  invoices: Invoice[];
  onClose: () => void;
}

export const InvoicePreview = ({ invoices, onClose }: InvoicePreviewProps) => {
  const [activeTab, setActiveTab] = useState(invoices[0]?.id || "");

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (invoice: Invoice) => {
    // In a real application, this would generate a PDF
    // For now, we'll just alert that it would download
    alert(`Downloading invoice ${invoice.id} for ${invoice.customerName}`);
  };

  if (invoices.length === 0) {
    return null;
  }

  return (
    <Card className="print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between print:hidden">
        <CardTitle>Invoice Preview</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={() => handleDownload(invoices.find(i => i.id === activeTab) || invoices[0])}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {invoices.length > 1 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
            <TabsList className="w-full mb-6">
              {invoices.map((invoice) => (
                <TabsTrigger key={invoice.id} value={invoice.id} className="flex-1">
                  {invoice.type === 'full' ? 'Full Invoice' : 
                   invoice.type === 'original' ? 'Original Costs' : 'Markup Invoice'}
                </TabsTrigger>
              ))}
            </TabsList>
            {invoices.map((invoice) => (
              <TabsContent key={invoice.id} value={invoice.id}>
                <InvoiceContent invoice={invoice} />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <InvoiceContent invoice={invoices[0]} />
        )}
      </CardContent>
    </Card>
  );
};

const InvoiceContent = ({ invoice }: { invoice: Invoice }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">INVOICE</h2>
          <p className="text-gray-500">#{invoice.id.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">BTEL ISP Services</p>
          <p>123 Business Road</p>
          <p>City, Country</p>
          <p>info@btelisp.com</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Bill To:</p>
          <p className="font-medium">{invoice.customerName}</p>
          <p>{invoice.customerAddress}</p>
          <p>{invoice.customerEmail}</p>
          <p>{invoice.customerPhone}</p>
        </div>
        <div className="text-right">
          <div className="flex justify-between md:justify-end md:space-x-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Invoice Date:</p>
              <p>{invoice.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Due Date:</p>
              <p>{invoice.dueDate}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₦{item.unitPrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₦{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end">
        <div className="w-full md:w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₦{invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Tax (10%):</span>
            <span className="font-medium">₦{invoice.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-t">
            <span className="font-bold">Total:</span>
            <span className="font-bold">₦{invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="font-medium mb-2">Notes:</h3>
        <p className="text-gray-600">{invoice.notes}</p>
        {invoice.type === 'markup' && (
          <p className="mt-2 text-gray-600">This invoice represents the markup costs only.</p>
        )}
        {invoice.type === 'original' && (
          <p className="mt-2 text-gray-600">This invoice represents the original supplier costs.</p>
        )}
      </div>
    </div>
  );
};
