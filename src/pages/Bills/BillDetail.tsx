import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import InvoicePreview from "@/components/invoice/InvoicePreview";

interface Customer {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
  gstNumber?: string;
}

interface BillItem {
  description: string;
  rate: number;
  quantity: number;
}

interface Bill {
  _id: string;
  billNumber: string;
  date: string;
  paymentStatus: string;
  paymentMethod?: string;
  items: BillItem[];
  gstRate: number;
  customer: Customer;
  totals: {
    subtotal: number;
    gst: number;
    total: number;
  };
}

const BillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ content: () => printRef.current });

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bills/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBill(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch bill details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBill();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto py-8">Loading bill details...</div>;
  }

  if (!bill) {
    return <div className="container mx-auto py-8">Bill not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Invoice {bill.billNumber} | Bill Management System</title>
        <meta name="description" content={`Invoice ${bill.billNumber} for ${bill.customer.name}. Download PDF.`} />
        <link rel="canonical" href={`/bills/${bill._id}`} />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoice {bill.billNumber}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/bills/new?edit=${bill._id}`)}>
            Edit
          </Button>
          <Button variant="hero" onClick={handlePrint}>
            Download PDF
          </Button>
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
              <div>{bill.customer.name}</div>
              {bill.customer.address && (
                <div className="text-sm text-muted-foreground">{bill.customer.address}</div>
              )}
              {bill.customer.phone && (
                <div className="text-sm text-muted-foreground">{bill.customer.phone}</div>
              )}
              {bill.customer.gstNumber && (
                <div className="text-sm text-muted-foreground">GST: {bill.customer.gstNumber}</div>
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
                {bill.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">₹{item.rate?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">₹{(item.rate * item.quantity)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                  <TableCell className="text-right">₹{bill.totals.subtotal?.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">GST ({bill.gstRate}%)</TableCell>
                  <TableCell className="text-right">₹{bill.totals.gst?.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">Grand Total</TableCell>
                  <TableCell className="text-right font-semibold">₹{bill.totals.total?.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="sr-only">
        <div ref={printRef}>
          <InvoicePreview bill={bill} />
        </div>
      </div>
    </div>
  );
};

export default BillDetail;