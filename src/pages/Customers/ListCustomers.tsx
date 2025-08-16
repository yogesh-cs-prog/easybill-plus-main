import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface Customer {
  _id: string;
  name: string;
  phone?: string;
  gstNumber?: string;
  address?: string;
}

const ListCustomers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const fetchCustomers = async (query = "", page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          page,
          limit: pagination.limit,
        },
      });

      setCustomers(response.data.items);
      setPagination({
        page: response.data.page,
        limit: pagination.limit,
        total: response.data.total,
        pages: response.data.pages,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCustomers(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, pagination.page]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    return customers.filter((c) => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

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
          <Link to="/customers/new">Add Customer</Link>
        </Button>
      </div>
      <div className="mb-3">
        <Input 
          placeholder="Search customers" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading customers...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer._id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => window.location.href = `/customers/${customer._id}`}
                  >
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone || "—"}</TableCell>
                    <TableCell>{customer.gstNumber || "—"}</TableCell>
                    <TableCell>{customer.address || "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {searchQuery ? "No matching customers found" : "No customers available"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListCustomers;