import React, { useRef } from 'react';
import { Invoice } from '@/types/isp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface InvoicePreviewProps {
  invoices: Invoice[];
  onClose: () => void;
}

export const InvoicePreview = ({ invoices, onClose }: InvoicePreviewProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (!invoiceRef.current) return;

    try {
      // Create a canvas from the invoice content
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add the image to the PDF
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Save the PDF
      pdf.save(`invoice-${invoices[0].id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
  }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Invoice Preview</h2>
        <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline">
            Download PDF
          </Button>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-4 w-4" />
          </Button>
          </div>
        </div>
        <CardContent className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          <div ref={invoiceRef} className="bg-white p-8">
            {invoices.map((invoice, index) => (
              <div key={invoice.id} className={index > 0 ? 'mt-8 pt-8 border-t' : ''}>
                <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold">INVOICE</h2>
          <p className="text-gray-500">#{invoice.id.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">BTEL SmartNet Services</p>
          <p>77 Nelson Mandela Street, Asokoro</p>
          <p>Abuja, Nigeria</p>
          <p>connect@btel.com.ng</p>
        </div>
      </div>
      
                <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-1">Bill To:</p>
          <p className="font-medium">{invoice.customerName}</p>
          <p>{invoice.customerAddress}</p>
          <p>{invoice.customerEmail}</p>
          <p>{invoice.customerPhone}</p>
        </div>
        <div className="text-right">
                    <div className="flex justify-end gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Invoice Date:</p>
                        <p>{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Due Date:</p>
                        <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Unit Price</th>
                      <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
                  <tbody>
            {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">{item.description}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">₦{item.unitPrice.toFixed(2)}</td>
                        <td className="text-right py-2">₦{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      
      <div className="flex justify-end">
                  <div className="w-64">
          <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>₦{invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
                      <span>Tax (5%):</span>
                      <span>₦{invoice.tax.toFixed(2)}</span>
          </div>
                    <div className="flex justify-between py-2 border-t font-bold">
                      <span>Total:</span>
                      <span>₦{invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
                <div className="mt-8 pt-8 border-t">
        <h3 className="font-medium mb-2">Notes:</h3>
        <p className="text-gray-600">{invoice.notes}</p>
        {invoice.type === 'markup' && (
          <p className="mt-2 text-gray-600">This invoice represents the markup costs only.</p>
        )}
        {invoice.type === 'base' && (
          <p className="mt-2 text-gray-600">This invoice represents the original supplier costs.</p>
        )}
      </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
