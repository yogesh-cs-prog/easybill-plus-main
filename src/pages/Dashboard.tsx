import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { bills, customers, summarizeBillsCount, summarizeMonthlyRevenue, summarizeTaxCollected } from "@/data/mock";

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

const Dashboard = () => {
  const revenue = useMemo(() => summarizeMonthlyRevenue(), []);
  const counts = useMemo(() => summarizeBillsCount(), []);
  const tax = useMemo(() => summarizeTaxCollected(), []);

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Dashboard | Bill Management System</title>
        <meta name="description" content="See revenue trends, bill counts, and tax collected. Track your business performance." />
        <link rel="canonical" href="/dashboard" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Stat label="Total Bills" value={bills.length} />
        <Stat label="Total Customers" value={customers.length} />
        <Stat label="Total Revenue (mock)" value={`₹${revenue.reduce((a, b) => a + b.revenue, 0).toLocaleString()}`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
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
              <BarChart data={counts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--accent-foreground))" />
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
              <LineChart data={tax}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tax" stroke="hsl(var(--ring))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
