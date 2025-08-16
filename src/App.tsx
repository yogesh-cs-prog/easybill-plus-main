import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ListBills from "./pages/Bills/ListBills";
import BillForm from "./pages/Bills/BillForm";
import BillDetail from "./pages/Bills/BillDetail";
import ListCustomers from "./pages/Customers/ListCustomers";
import CustomerDetail from "./pages/Customers/CustomerDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./ProtecRoute";
import AddCustomer from "./pages/Customers/AddCustomer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="bills" element={<ListBills />} />
                  <Route path="bills/new" element={<BillForm />} />
                  <Route path="bills/:id" element={<BillDetail />} />
                  <Route path="customers" element={<ListCustomers />} />
                  <Route path="customers/new" element={<AddCustomer />} />
                  <Route path="customers/:id" element={<CustomerDetail />} />
                </Route>
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;