import { Helmet } from "react-helmet-async";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customers } from "@/data/mock";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  billNumber: z.string().min(1),
  customerId: z.string().min(1),
  date: z.string().min(1),
  gstRate: z.coerce.number().min(0),
});

type FormData = z.infer<typeof schema>;

const BillForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      gstRate: 18,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Example items - in real app, capture them via form
      const items = [
        { description: "Sample Item", rate: 100, quantity: 2 },
      ];

      const res = await fetch("http://localhost:5000/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // auth token from login
        },
        body: JSON.stringify({
          ...data,
          items,
          paymentStatus: "Pending",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create bill");
      }

      toast({
        title: "Bill created",
        description: "Your bill has been saved successfully.",
      });

      navigate("/bills");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>New Bill | Bill Management System</title>
        <meta name="description" content="Create a new invoice with GST, customer details, and items." />
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Create Bill</h1>

      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 max-w-xl" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm mb-1">Bill Number</label>
              <Input {...register("billNumber")} placeholder="INV-1004" />
              {errors.billNumber && <p className="text-sm text-destructive mt-1">Required</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Customer</label>
              <Select onValueChange={(v) => setValue("customerId", "6898b3fa7e6ddf1fd2949281")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-sm text-destructive mt-1">Required</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Date</label>
              <Input type="date" {...register("date")} />
              {errors.date && <p className="text-sm text-destructive mt-1">Required</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">GST Rate (%)</label>
              <Input type="number" step="1" {...register("gstRate", { valueAsNumber: true })} />
              {errors.gstRate && <p className="text-sm text-destructive mt-1">Invalid</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="hero">Save Bill</Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillForm;
