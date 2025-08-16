import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

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
  customer: {
    _id: string;
    name: string;
  };
  totals: {
    subtotal: number;
    gstAmount: number;
    total: number;
  };
}

const ListBills = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const navigate = useNavigate();

  const fetchBills = async (query = "", page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/bills", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          page,
          limit: pagination.limit,
        },
      });

      setBills(response.data.items);
      setPagination({
        page: response.data.page,
        limit: pagination.limit,
        total: response.data.total,
        pages: response.data.pages,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBills(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, pagination.page]);

  const filteredBills = useMemo(() => {
    if (!searchQuery) return bills;
    return bills.filter((bill) => 
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bills, searchQuery]);

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Bills | Bill Management System</title>
        <meta name="description" content="View, search, and manage bills. Download invoices as PDF." />
        <link rel="canonical" href="/bills" />
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bills</h1>
        <Button variant="hero" onClick={() => navigate("/bills/new")}>
          New Bill
        </Button>
      </div>
      <div className="flex items-center justify-between gap-4 mb-3">
        <Input 
          placeholder="Search by bill no. or customer" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading bills...</p>
        </div>
      ) : (
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
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <TableRow 
                    key={bill._id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/bills/${bill._id}`)}
                  >
                    <TableCell>{bill.billNumber}</TableCell>
                    <TableCell>{bill.customer.name}</TableCell>
                    <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                    <TableCell>{bill.paymentStatus}</TableCell>
                    <TableCell className="text-right">
                      ₹{bill?.totals?.total?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchQuery ? "No matching bills found" : "No bills available"}
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

export default ListBills;