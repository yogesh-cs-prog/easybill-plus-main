import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customers, getBillsByCustomer, getGrandTotal } from "@/data/mock";
import { useMemo, useState } from "react";

const ListCustomers = () => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Customers | Bill Management System</title>
        <meta name="description" content="Manage customers and view statements with outstanding amounts." />
        <link rel="canonical" href="/customers" />
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button variant="hero" asChild>
          <Link to="/register">Add Customer</Link>
        </Button>
      </div>
      <div className="mb-3">
        <Input placeholder="Search customers" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>GST</TableHead>
              <TableHead className="text-right">Total Billed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => {
              const bills = getBillsByCustomer(c.id);
              const total = bills.reduce((sum, b) => sum + getGrandTotal(b), 0);
              return (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => (window.location.href = `/customers/${c.id}`)}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.gstNumber || "—"}</TableCell>
                  <TableCell className="text-right">₹{total.toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListCustomers;
