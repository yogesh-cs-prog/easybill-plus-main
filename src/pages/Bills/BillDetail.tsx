import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bills, customers, getCustomerById, getBillSubtotal, getGstAmount, getGrandTotal } from "@/data/mock";
import { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoicePreview from "@/components/invoice/InvoicePreview";

const BillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bill = useMemo(() => bills.find((b) => b.id === id), [id]);
  const customer = bill ? getCustomerById(bill.customerId) : undefined;

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ content: () => printRef.current });

  if (!bill) return <div className="container mx-auto py-8">Bill not found.</div>;

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Invoice {bill.billNumber} | Bill Management System</title>
        <meta name="description" content={`Invoice ${bill.billNumber} for ${customer?.name || "customer"}. Download PDF.`} />
        <link rel="canonical" href={`/bills/${bill.id}`} />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoice {bill.billNumber}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/bills/new?edit=${bill.id}`)}>Edit</Button>
          <Button variant="hero" onClick={handlePrint}>Download PDF</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bill Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="font-semibold mb-1">Customer</div>
              <div>{customer?.name}</div>
              <div className="text-sm text-muted-foreground">{customer?.address}</div>
              <div className="text-sm text-muted-foreground">{customer?.phone}</div>
              {customer?.gstNumber && (
                <div className="text-sm text-muted-foreground">GST: {customer.gstNumber}</div>
              )}
            </div>
            <div className="md:text-right">
              <div>Date: {new Date(bill.date).toLocaleDateString()}</div>
              <div>Status: {bill.paymentStatus}</div>
              {bill.paymentMethod && <div>Method: {bill.paymentMethod}</div>}
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bill.items.map((it, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{it.description}</TableCell>
                    <TableCell className="text-right">₹{it.rate.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{it.quantity}</TableCell>
                    <TableCell className="text-right">₹{(it.rate * it.quantity).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                  <TableCell className="text-right">₹{getBillSubtotal(bill).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">GST ({bill.gstRate}%)</TableCell>
                  <TableCell className="text-right">₹{getGstAmount(bill).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">Grand Total</TableCell>
                  <TableCell className="text-right font-semibold">₹{getGrandTotal(bill).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="sr-only">
        <div ref={printRef}>
          <InvoicePreview bill={bill} customer={customer!} />
        </div>
      </div>
    </div>
  );
};

export default BillDetail;
