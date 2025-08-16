import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar 
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface MonthlyData {
  month: string;
  revenue: number;
  count: number;
  tax: number;
}

interface Bill {
  _id: string;
  totals: {
    total: number;
    gst: number;
  };
}

interface Customer {
  _id: string;
}

interface ApiResponse<T> {
  items: T[];
  total: number;
}

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold">{value}</div>
    </CardContent>
  </Card>
);

const formatMonth = (monthString: string) => {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalTax: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all data in parallel
        const [billsRes, customersRes, monthlyRes] = await Promise.all([
          axios.get<ApiResponse<Bill>>("http://localhost:5000/api/bills", { headers }),
          axios.get<ApiResponse<Customer>>("http://localhost:5000/api/customers", { headers }),
          axios.get<{data: MonthlyData[]}>("http://localhost:5000/api/statements/monthly", { headers })
        ]);

        // Calculate totals
        const totalRevenue = billsRes.data.items.reduce((sum, bill) => sum + bill.totals.total, 0);
        const totalTax = billsRes.data.items.reduce((sum, bill) => sum + bill.totals.gst, 0);

        setStats({
          totalBills: billsRes.data.total,
          totalCustomers: customersRes.data.total,
          totalRevenue,
          totalTax,
        });

        // Format monthly data
        const formattedMonthlyData = monthlyRes.data.data.map(item => ({
          month: formatMonth(item.month),
          revenue: item.revenue,
          count: item.count,
          tax: item.tax
        }));

        setMonthlyData(formattedMonthlyData);

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="container mx-auto py-8">Please login to view this page</div>;
  }

  if (loading) {
    return <div className="container mx-auto py-8">Loading dashboard data...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Dashboard | Bill Management System</title>
        <meta name="description" content="See revenue trends, bill counts, and tax collected. Track your business performance." />
        <link rel="canonical" href="/dashboard" />
      </Helmet>
      
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Bills" value={stats.totalBills} />
        <Stat label="Total Customers" value={stats.totalCustomers} />
        <Stat label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} />
        <Stat label="Total Tax Collected" value={`₹${stats.totalTax.toLocaleString('en-IN')}`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, "Revenue"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bills per Month</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, "Bills"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--accent-foreground))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Collected</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, "Tax"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="tax" 
                  stroke="hsl(var(--ring))" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;