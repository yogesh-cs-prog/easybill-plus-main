export type PaymentStatus = "Paid" | "Pending";
export type PaymentMethod = "Cash" | "Cheque" | "Bank Transfer" | "UPI" | "Other"; // Added payment method types

export interface UserProfile {
  _id: string;
  companyName: string;
  gstin: string;
  email: string;
  password?: string; // Only for forms, should be omitted when sending to client
  logoUrl?: string;
  address: string; // Made required to match your schema
  phone?: string;
  pincode: number; // Added to match your schema
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Customer {
  _id: string;
  user: string; // Reference to User ID
  name: string;
  address: string;
  phone: string;
  gstNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface BillItem {
  description: string;
  rate: number;
  quantity: number;
  // If you need to add more fields later:
  // unit?: string;
  // hsnCode?: string;
}

export interface BillTotals {
  subtotal: number;
  gst: number;
  total: number;
  // If you need to add more fields later:
  // discount?: number;
  // shipping?: number;
}

export interface Bill {
  _id: string;
  user: UserProfile;
  billNumber: string;
  date: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod; // Now using the defined type
  items: BillItem[];
  gstRate: number;
  customer: Customer;
  totals: BillTotals;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateBillDTO extends Omit<Bill, "_id" | "user" | "customer" | "createdAt" | "updatedAt" | "__v"> {
  customer: string;
}

export interface UpdateBillDTO extends Partial<CreateBillDTO> {}