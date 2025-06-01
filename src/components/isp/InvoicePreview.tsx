import { useState, useRef } from "react";
import { Invoice } from "@/types/isp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";

interface InvoicePreviewProps {
  invoices: Invoice[];
  onClose: () => void;
}

export const InvoicePreview = ({ invoices, onClose }: InvoicePreviewProps) => {
  const [activeTab, setActiveTab] = useState(invoices[0]?.id || "");
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    if (!printContent) return;

    // Get the current invoice
    const currentInvoice = invoices.find(i => i.id === activeTab) || invoices[0];

    // Create a hidden iframe instead of a new window
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      return;
    }

    // Write the content to the iframe
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice Print</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 40px;
              color: #1a1a1a;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .invoice-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }
            
            .invoice-title {
              font-size: 24px;
              font-weight: 700;
              margin: 0;
            }
            
            .invoice-number {
              color: #666;
              margin-top: 4px;
            }
            
            .company-details {
              text-align: right;
            }
            
            .company-logo {
              width: 40px;
              height: 40px;
              margin-bottom: 8px;
            }
            
            .company-name {
              font-weight: 600;
              font-size: 16px;
              margin: 0;
            }
            
            .company-address {
              color: #666;
              margin: 4px 0;
            }
            
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            
            .customer-details h3,
            .invoice-dates h3 {
              font-size: 14px;
              color: #666;
              margin: 0 0 8px 0;
            }
            
            .customer-details p,
            .invoice-dates p {
              margin: 4px 0;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            
            th {
              background-color: #f8f9fa;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 12px;
              color: #666;
              border-bottom: 2px solid #e9ecef;
            }
            
            td {
              padding: 12px;
              border-bottom: 1px solid #e9ecef;
            }
            
            .totals {
              width: 300px;
              margin-left: auto;
            }
            
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }
            
            .totals-row.total {
              border-top: 2px solid #e9ecef;
              font-weight: 600;
              margin-top: 8px;
              padding-top: 16px;
            }
            
            .notes {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e9ecef;
            }
            
            .notes h3 {
              font-size: 14px;
              color: #666;
              margin: 0 0 8px 0;
            }
            
            .notes p {
              margin: 4px 0;
              color: #666;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <h1 class="invoice-title">INVOICE</h1>
              <p class="invoice-number">#${currentInvoice.id.toUpperCase()}</p>
            </div>
            <div class="company-details">
              <img src="/logo.png" alt="Logo" class="company-logo" />
              <p class="company-name">BTEL SmartNet Services</p>
              <p class="company-address">77 Nelson Mandela Street, Asokoro</p>
              <p class="company-address">Abuja, Nigeria</p>
              <p class="company-address">connect@btel.com.ng</p>
            </div>
          </div>
          
          <div class="invoice-details">
            <div class="customer-details">
              <h3>Bill To:</h3>
              <p>${currentInvoice.customerName}</p>
              <p>${currentInvoice.customerAddress}</p>
              <p>${currentInvoice.customerEmail}</p>
              <p>${currentInvoice.customerPhone}</p>
            </div>
            <div class="invoice-dates">
              <h3>Invoice Date:</h3>
              <p>${currentInvoice.date}</p>
              <h3>Due Date:</h3>
              <p>${currentInvoice.dueDate}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th style="text-align: right">Qty</th>
                <th style="text-align: right">Unit Price</th>
                <th style="text-align: right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${currentInvoice.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.description}</td>
                  <td style="text-align: right">${item.quantity}</td>
                  <td style="text-align: right">₦${item.unitPrice.toFixed(2)}</td>
                  <td style="text-align: right">₦${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>₦${currentInvoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>Tax (5%):</span>
              <span>₦${currentInvoice.tax.toFixed(2)}</span>
            </div>
            <div class="totals-row total">
              <span>Total:</span>
              <span>₦${currentInvoice.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="notes">
            <h3>Notes:</h3>
            <p>${currentInvoice.notes || ''}</p>
            ${currentInvoice.type === 'markup' ? 
              '<p>This invoice represents the markup costs only.</p>' : 
              currentInvoice.type === 'base' ? 
              '<p>This invoice represents the original supplier costs.</p>' : 
              ''}
          </div>
        </body>
      </html>
    `);

    iframeDoc.close();

    // Wait for images to load before printing
    const printIframe = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (error) {
        console.error('Error printing:', error);
      } finally {
        // Clean up the iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }
    };

    // Check if images are loaded
    const images = iframeDoc.getElementsByTagName('img');
    let loadedImages = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      printIframe();
    } else {
      Array.from(images).forEach(img => {
        if (img.complete) {
          loadedImages++;
          if (loadedImages === totalImages) {
            printIframe();
          }
        } else {
          img.onload = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
              printIframe();
            }
          };
          img.onerror = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
              printIframe();
            }
          };
        }
      });
    }
  };

  const handleDownload = (invoice: Invoice) => {
    if (!invoiceRef.current) return;

    const element = invoiceRef.current;
    const opt = {
      margin: 1,
      filename: `invoice-${invoice.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Add print-specific styles to the clone
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      body {
        font-family: 'Inter', sans-serif;
        padding: 40px;
      }
      
      .invoice-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
      }
      
      .invoice-title {
        font-size: 24px;
        font-weight: 700;
        margin: 0;
      }
      
      .invoice-number {
        color: #666;
        margin-top: 4px;
      }
      
      .company-details {
        text-align: right;
      }
      
      .company-logo {
        width: 40px;
        height: 40px;
        margin-bottom: 8px;
      }
      
      .company-name {
        font-weight: 600;
        font-size: 16px;
        margin: 0;
      }
      
      .company-address {
        color: #666;
        margin: 4px 0;
      }
      
      .invoice-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin-bottom: 40px;
      }
      
      .customer-details h3,
      .invoice-dates h3 {
        font-size: 14px;
        color: #666;
        margin: 0 0 8px 0;
      }
      
      .customer-details p,
      .invoice-dates p {
        margin: 4px 0;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 40px;
      }
      
      th {
        background-color: #f8f9fa;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        font-size: 12px;
        color: #666;
        border-bottom: 2px solid #e9ecef;
      }
      
      td {
        padding: 12px;
        border-bottom: 1px solid #e9ecef;
      }
      
      .totals {
        width: 300px;
        margin-left: auto;
      }
      
      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
      }
      
      .totals-row.total {
        border-top: 2px solid #e9ecef;
        font-weight: 600;
        margin-top: 8px;
        padding-top: 16px;
      }
      
      .notes {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e9ecef;
      }
      
      .notes h3 {
        font-size: 14px;
        color: #666;
        margin: 0 0 8px 0;
      }
      
      .notes p {
        margin: 4px 0;
        color: #666;
      }
    `;
    clonedElement.appendChild(style);

    // Create a temporary container
    const container = document.createElement('div');
    container.appendChild(clonedElement);
    document.body.appendChild(container);

    // Generate PDF
    html2pdf().set(opt).from(container).save().then(() => {
      // Clean up
      document.body.removeChild(container);
    });
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
                   invoice.type === 'base' ? 'Original Costs' : 'Markup Invoice'}
                </TabsTrigger>
              ))}
            </TabsList>
            {invoices.map((invoice) => (
              <TabsContent key={invoice.id} value={invoice.id}>
                <div id="invoice-content" ref={invoiceRef}>
                  <InvoiceContent invoice={invoice} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div id="invoice-content" ref={invoiceRef}>
            <InvoiceContent invoice={invoices[0]} />
          </div>
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
        <img src="logo.png" alt="Logo" className="w-10 h-10" />
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  ₦{typeof item.unitPrice === 'number' ? item.unitPrice.toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  ₦{typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end">
        <div className="w-full md:w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₦{typeof invoice.subtotal === 'number' ? invoice.subtotal.toFixed(2) : '0.00'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Tax (5%):</span>
            <span className="font-medium">₦{typeof invoice.tax === 'number' ? invoice.tax.toFixed(2) : '0.00'}</span>
          </div>
          <div className="flex justify-between py-2 border-t">
            <span className="font-bold">Total:</span>
            <span className="font-bold">₦{typeof invoice.total === 'number' ? invoice.total.toFixed(2) : '0.00'}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
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
  );
};
