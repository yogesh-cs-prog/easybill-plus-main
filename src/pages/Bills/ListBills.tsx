import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bills, customers, getCustomerById, getGrandTotal } from "@/data/mock";
import { useMemo, useState } from "react";

const ListBills = () => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!q) return bills;
    return bills.filter((b) => {
      const c = getCustomerById(b.customerId);
      return (
        b.billNumber.toLowerCase().includes(q.toLowerCase()) ||
        c?.name.toLowerCase().includes(q.toLowerCase())
      );
    });
  }, [q]);

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Bills | Bill Management System</title>
        <meta name="description" content="View, search, and manage bills. Download invoices as PDF." />
        <link rel="canonical" href="/bills" />
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bills</h1>
        <Button variant="hero" onClick={() => navigate("/bills/new")}>New Bill</Button>
      </div>
      <div className="flex items-center justify-between gap-4 mb-3">
        <Input placeholder="Search by bill no. or customer" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => {
              const c = customers.find((x) => x.id === b.customerId);
              return (
                <TableRow key={b.id} className="cursor-pointer" onClick={() => navigate(`/bills/${b.id}`)}>
                  <TableCell>{b.billNumber}</TableCell>
                  <TableCell>{c?.name}</TableCell>
                  <TableCell>{new Date(b.date).toLocaleDateString()}</TableCell>
                  <TableCell>{b.paymentStatus}</TableCell>
                  <TableCell className="text-right">₹{getGrandTotal(b).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Tip: Connect Supabase to enable real CRUD, pagination, and secure data isolation per company.
        {" "}<Link to="/register" className="underline">Learn more</Link>
      </div>
    </div>
  );
};

export default ListBills;
