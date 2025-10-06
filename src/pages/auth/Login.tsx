import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>({ 
    resolver: zodResolver(schema) 
  });
  const { login } = useAuth();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        // Handle validation errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err: any) => {
            toast({
              title: "Validation Error",
              description: err.msg || err.message,
              variant: "destructive",
            });
          });
          return;
        }

        // Handle general errors
        throw new Error(result.message || "Login failed");
      }

      login(result.token, result.user);

      // Save token & user info
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      toast({ 
        title: "Login Successful", 
        description: `Welcome back, ${result.user.companyName}` 
      });
      
      navigate("/dashboard");
    } catch (err: any) {
      toast({ 
        title: "Login Failed", 
        description: err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Helmet>
        <title>Login | Bill Management System</title>
        <meta name="description" content="Sign in to manage invoices, customers, and reports." />
        <link rel="canonical" href="/login" />
      </Helmet>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input 
                type="email" 
                {...register("email")} 
                disabled={isLoading}
                placeholder="you@example.com"
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
                disabled={isLoading}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            {/* <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div> */}

            <Button 
              type="submit" 
              variant="hero" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg 
                    className="animate-spin h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            No account? <Link to="/register" className="underline text-primary">Create one</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;