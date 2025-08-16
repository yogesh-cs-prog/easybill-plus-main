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

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { login } = useAuth();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      login(result.token, result.user);

      // Save token & user info
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      toast({ title: "Login Successful", description: `Welcome back, ${result.user.companyName}` });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
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
              <Input type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive mt-1">Enter a valid email</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input type="password" {...register("password")} />
              {errors.password && <p className="text-sm text-destructive mt-1">Min 6 characters</p>}
            </div>
            <Button type="submit" variant="hero">Login</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">
            No account? <Link to="/register" className="underline">Create one</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
