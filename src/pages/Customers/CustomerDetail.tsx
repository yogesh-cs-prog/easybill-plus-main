import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customers, getBillsByCustomer, getGrandTotal } from "@/data/mock";
import { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const CustomerDetail = () => {
  const { id } = useParams();
  const customer = customers.find((c) => c.id === id);
  const bills = useMemo(() => (id ? getBillsByCustomer(id) : []), [id]);
  const total = bills.reduce((s, b) => s + getGrandTotal(b), 0);

  const ref = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ content: () => ref.current });

  if (!customer) return <div className="container mx-auto py-8">Customer not found</div>;

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>{customer.name} | Statement</title>
        <meta name="description" content={`Statement of ${customer.name} with total billed and invoices.`} />
        <link rel="canonical" href={`/customers/${customer.id}`} />
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
            {bills.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.billNumber}</TableCell>
                <TableCell>{new Date(b.date).toLocaleDateString()}</TableCell>
                <TableCell>{b.paymentStatus}</TableCell>
                <TableCell className="text-right">₹{getGrandTotal(b).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
              <TableCell className="text-right font-semibold">₹{total.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="sr-only">
        <div ref={ref}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{customer.name} — Statement</h2>
            <p className="text-sm text-muted-foreground mb-4">{customer.address} • {customer.phone}</p>
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
                {bills.map((b) => (
                  <tr key={b.id}>
                    <td style={{ padding: '8px' }}>{b.billNumber}</td>
                    <td style={{ padding: '8px' }}>{new Date(b.date).toLocaleDateString()}</td>
                    <td style={{ padding: '8px' }}>{b.paymentStatus}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>₹{getGrandTotal(b).toLocaleString()}</td>
                  </tr>
                ))}
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
