import type { Bill, Customer, UserProfile } from "@/types";

export const mockUser: UserProfile = {
  id: "u_1",
  companyName: "Nimbus Invoices Pvt. Ltd.",
  gstin: "27ABCDE1234F1Z5",
  email: "admin@nimbus.example",
};

export const customers: Customer[] = [
  {
    id: "c_1",
    name: "Acme Retailers",
    address: "221B Baker Street, London",
    phone: "+44 20 7946 0958",
    gstNumber: "29AACCF1234Q1ZV",
  },
  {
    id: "c_2",
    name: "Sunrise Hardware",
    address: "MG Road, Pune, MH",
    phone: "+91 98765 43210",
    gstNumber: "27AAAPL1234C1ZV",
  },
  {
    id: "c_3",
    name: "Pixel Studio",
    address: "5th Ave, New York, NY",
    phone: "+1 (212) 555-0199",
  },
];

export const bills: Bill[] = [
  {
    id: "b_1001",
    billNumber: "INV-1001",
    customerId: "c_1",
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    items: [
      { description: "Steel Rods", rate: 1200, quantity: 5 },
      { description: "Nuts & Bolts", rate: 12, quantity: 200 },
    ],
    gstRate: 18,
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    notes: "Delivered in good condition",
  },
  {
    id: "b_1002",
    billNumber: "INV-1002",
    customerId: "c_2",
    date: new Date().toISOString(),
    items: [
      { description: "Cement Bags", rate: 380, quantity: 50 },
    ],
    gstRate: 18,
    paymentStatus: "Pending",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "b_1003",
    billNumber: "INV-1003",
    customerId: "c_3",
    date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
    items: [
      { description: "Brand Identity Design", rate: 40000, quantity: 1 },
      { description: "Business Cards", rate: 25, quantity: 200 },
    ],
    gstRate: 18,
    paymentStatus: "Paid",
    paymentMethod: "Card",
  },
];

export function getCustomerById(id: string) {
  return customers.find((c) => c.id === id);
}

export function getBillSubtotal(bill: Bill) {
  return bill.items.reduce((sum, i) => sum + i.rate * i.quantity, 0);
}

export function getGstAmount(bill: Bill) {
  return (getBillSubtotal(bill) * bill.gstRate) / 100;
}

export function getGrandTotal(bill: Bill) {
  return getBillSubtotal(bill) + getGstAmount(bill);
}

export function getBillsByCustomer(customerId: string) {
  return bills.filter((b) => b.customerId === customerId);
}

export function summarizeMonthlyRevenue() {
  const map = new Map<string, number>();
  bills.forEach((b) => {
    const d = new Date(b.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) || 0) + getGrandTotal(b));
  });
  return Array.from(map.entries())
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }));
}

export function summarizeBillsCount() {
  const map = new Map<string, number>();
  bills.forEach((b) => {
    const d = new Date(b.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([month, count]) => ({ month, count }));
}

export function summarizeTaxCollected() {
  const map = new Map<string, number>();
  bills.forEach((b) => {
    const d = new Date(b.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) || 0) + getGstAmount(b));
  });
  return Array.from(map.entries())
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([month, tax]) => ({ month, tax: Math.round(tax) }));
}
