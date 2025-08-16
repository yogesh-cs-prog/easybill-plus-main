import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface Customer {
  _id: string;
  name: string;
  phone?: string;
  gstNumber?: string;
  address?: string;
}

interface Bill {
  _id: string;
  billNumber: string;
  date: string;
  paymentStatus: string;
  items: Array<{
    description: string;
    rate: number;
    quantity: number;
  }>;
  gstRate: number;
}

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ content: () => ref.current });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Fetch customer details
        const customerResponse = await axios.get(`http://localhost:5000/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Fetch customer's bills
        const billsResponse = await axios.get(`http://localhost:5000/api/bills?customerId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCustomer(customerResponse.data);
        setBills(billsResponse.data.items || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch customer data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const total = useMemo(() => {
    return bills.reduce((sum, bill) => {
      const subtotal = bill.items.reduce((s, item) => s + (item.rate * item.quantity), 0);
      const gstAmount = subtotal * (bill.gstRate / 100);
      return sum + subtotal + gstAmount;
    }, 0);
  }, [bills]);

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!customer) {
    return <div className="container mx-auto py-8">Customer not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>{customer.name} | Statement</title>
        <meta name="description" content={`Statement of ${customer.name} with total billed and invoices.`} />
        <link rel="canonical" href={`/customers/${customer._id}`} />
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{customer.name} — Statement</h1>
        <Button variant="hero" onClick={handlePrint}>Export PDF</Button>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {customer.address} • {customer.phone} {customer.gstNumber ? `• GST: ${customer.gstNumber}` : ""}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => {
              const subtotal = bill.items.reduce((s, item) => s + (item.rate * item.quantity), 0);
              const gstAmount = subtotal * (bill.gstRate / 100);
              const total = subtotal + gstAmount;
              
              return (
                <TableRow key={bill._id}>
                  <TableCell>{bill.billNumber}</TableCell>
                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                  <TableCell>{bill.paymentStatus}</TableCell>
                  <TableCell className="text-right">₹{total.toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
              <TableCell className="text-right font-semibold">₹{total.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Hidden content for PDF export */}
      <div className="sr-only">
        <div ref={ref}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{customer.name} — Statement</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {customer.address} • {customer.phone}
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid hsl(var(--border))' }}>Bill #</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid hsl(var(--border))' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid hsl(var(--border))' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid hsl(var(--border))' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => {
                  const subtotal = bill.items.reduce((s, item) => s + (item.rate * item.quantity), 0);
                  const gstAmount = subtotal * (bill.gstRate / 100);
                  const total = subtotal + gstAmount;
                  
                  return (
                    <tr key={bill._id}>
                      <td style={{ padding: '8px' }}>{bill.billNumber}</td>
                      <td style={{ padding: '8px' }}>{new Date(bill.date).toLocaleDateString()}</td>
                      <td style={{ padding: '8px' }}>{bill.paymentStatus}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>₹{total.toLocaleString()}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td style={{ padding: '8px' }} colSpan={3}><strong>Total</strong></td>
                  <td style={{ padding: '8px', textAlign: 'right' }}><strong>₹{total.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;