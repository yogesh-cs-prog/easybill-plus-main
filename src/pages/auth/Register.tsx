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

const schema = z.object({
  companyName: z.string().min(2),
  gstin: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(6),
  address: z.string().min(10),
  pincode: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const { token, user } = await response.json();
      
      // Store token and user data (you might want to use context or state management)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Helmet>
        <title>Register | Bill Management System</title>
        <meta name="description" content="Create your business account with company and GST details." />
        <link rel="canonical" href="/register" />
      </Helmet>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm mb-1">Company Name</label>
              <Input 
                {...register("companyName")} 
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">GSTIN</label>
              <Input 
                {...register("gstin")} 
                placeholder="Enter your GSTIN number"
              />
              {errors.gstin && (
                <p className="text-sm text-destructive mt-1">
                  {errors.gstin.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input 
                type="email" 
                {...register("email")} 
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input 
                type="password" 
                {...register("password")} 
                placeholder="Create a password (min 6 characters)"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Address</label>
              <Input 
                type="text" 
                {...register("address")} 
                placeholder="Paste your address"
              />
              {errors.address && (
                <p className="text-sm text-destructive mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Pincode</label>
              <Input 
                type="number" 
                {...register("pincode")} 
                placeholder="Paste your pincode"
              />
              {errors.pincode && (
                <p className="text-sm text-destructive mt-1">
                  {errors.pincode.message}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              variant="hero" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">
            Have an account?{" "}
            <Link to="/login" className="underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;