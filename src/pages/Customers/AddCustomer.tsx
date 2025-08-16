import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  gstNumber: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const AddCustomer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>({ 
    resolver: zodResolver(schema) 
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/customers`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      toast({
        title: "Customer created successfully!",
        description: "The customer has been added to your records.",
      });
      navigate("/customers");
    } catch (error: any) {
      let errorMessage = "Failed to create customer";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
        
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach((err: any) => {
            toast({
              title: "Validation Error",
              description: `${err.field}: ${err.message}`,
              variant: "destructive",
            });
          });
          return;
        }
      }

      toast({
        title: "Creation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Helmet>
        <title>Add Customer | Bill Management System</title>
        <meta name="description" content="Add a new customer to your records" />
        <link rel="canonical" href="/customers/add" />
      </Helmet>
      <Card>
        <CardHeader>
          <CardTitle>Add New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm mb-1">Name *</label>
              <Input 
                {...register("name")} 
                placeholder="Customer name"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Address</label>
              <Input 
                {...register("address")} 
                placeholder="Customer address"
              />
              {errors.address && (
                <p className="text-sm text-destructive mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Phone Number</label>
              <Input 
                {...register("phone")} 
                placeholder="Customer phone number"
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">GST Number</label>
              <Input 
                {...register("gstNumber")} 
                placeholder="Customer GST number"
              />
              {errors.gstNumber && (
                <p className="text-sm text-destructive mt-1">
                  {errors.gstNumber.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                variant="hero" 
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Customer"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/customers")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCustomer;