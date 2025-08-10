export type PaymentStatus = "Paid" | "Pending";

export interface UserProfile {
  id: string;
  companyName: string;
  gstin: string;
  email: string;
  logoUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  gstNumber?: string;
}

export interface BillItem {
  description: string;
  rate: number;
  quantity: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerId: string;
  date: string; // ISO string
  items: BillItem[];
  gstRate: number; // e.g., 18 for 18%
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  notes?: string;
}
