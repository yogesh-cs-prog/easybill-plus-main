import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { fetchCustomers } from "@/api/customers";

const schema = z.object({
  billNumber: z.string().min(1, "Bill number is required"),
  customerId: z.string().min(1, "Customer is required"),
  date: z.string().min(1, "Date is required"),
  gstRate: z.coerce.number().min(0, "GST rate must be positive"),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      rate: z.coerce.number().min(0, "Rate must be positive"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "At least one item is required"),
});

type FormData = z.infer<typeof schema>;

const BillForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [customers, setCustomers] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      gstRate: 18,
      items: [{ description: "", rate: 0, quantity: 1 }],
    },
  });

  const items = watch("items");

  const addItem = () => {
    setValue("items", [...items, { description: "", rate: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setValue("items", newItems);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/bills`, {
        ...data,
        paymentStatus: "Pending",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Bill created",
        description: "Your bill has been saved successfully.",
      });
      navigate("/bills");
    } catch (error: any) {
      let errorMessage = "Failed to create bill";
      
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
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


    useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    
    loadCustomers();
  }, []);
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>New Bill | Bill Management System</title>
        <meta name="description" content="Create a new invoice with GST, customer details, and items." />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create Bill</h1>
        <Button variant="outline" onClick={() => navigate("/bills")}>
          Back to Bills
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Bill Number *</label>
                  <Input
                    {...register("billNumber")}
                    placeholder="INV-1004"
                  />
                  {errors.billNumber?.message && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.billNumber.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Date *</label>
                  <Input
                    type="date"
                    {...register("date")}
                  />
                  {errors.date?.message && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Customer *</label>
                <Select
                  onValueChange={(value) => setValue("customerId", value)}
                  disabled={isLoadingCustomers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoadingCustomers ? "Loading customers..." : "Select customer"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCustomers ? (
                      <SelectItem value="loading" disabled>
                        Loading customers...
                      </SelectItem>
                    ) : customers.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No customers found
                      </SelectItem>
                    ) : (
                      customers.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          {customer.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.customerId?.message && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.customerId.message}
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-sm mb-1">GST Rate (%) *</label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("gstRate", { valueAsNumber: true })}
                />
                {errors.gstRate?.message && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.gstRate.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <label className="block text-sm mb-1">Description *</label>
                      <Input
                        {...register(`items.${index}.description`)}
                        placeholder="Item description"
                      />
                      {errors.items?.[index]?.description?.message && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.items[index]?.description?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm mb-1">Rate *</label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.rate`, { valueAsNumber: true })}
                      />
                      {errors.items?.[index]?.rate?.message && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.items[index]?.rate?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm mb-1">Qty *</label>
                      <Input
                        type="number"
                        min="1"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      />
                      {errors.items?.[index]?.quantity?.message && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.items[index]?.quantity?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm mb-1">Amount</label>
                      <div className="h-10 flex items-center">
                        {(item.rate * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={items.length <= 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-destructive"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {errors.items?.message && (
                <p className="text-sm text-destructive mt-2">
                  {errors.items.message}
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={addItem}
              >
                Add Item
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/bills")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Bill"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BillForm;