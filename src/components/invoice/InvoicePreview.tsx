import { forwardRef } from "react";
import logo from "@/assets/logo-mark.png";
import { Bill, Customer } from "@/types";
import { getBillSubtotal, getGstAmount, getGrandTotal } from "@/data/mock";

interface Props {
  bill: Bill;
  customer: Customer;
}

const InvoicePreview = forwardRef<HTMLDivElement, Props>(({ bill, customer }, ref) => {
  return (
    <div ref={ref || null} style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif', color: 'hsl(var(--foreground))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="Company logo" style={{ height: 36, width: 36 }} />
          <div>
            <div style={{ fontWeight: 700 }}>Tallyfixr Pvt. Ltd.</div>
            <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>GSTIN: 27ABCDE1234F1Z5</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>INVOICE</div>
          <div style={{ fontSize: 12 }}>#{bill.billNumber}</div>
          <div style={{ fontSize: 12 }}>Date: {new Date(bill.date).toLocaleDateString()}</div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid hsl(var(--border))', margin: '16px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Bill To</div>
          <div>{customer.name}</div>
          <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{customer.address}</div>
          <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{customer.phone}</div>
          {customer.gstNumber && (
            <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>GST: {customer.gstNumber}</div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12 }}>Payment Status: {bill.paymentStatus}</div>
          {bill.paymentMethod && <div style={{ fontSize: 12 }}>Method: {bill.paymentMethod}</div>}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid hsl(var(--border))' }}>Description</th>
            <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid hsl(var(--border))' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid hsl(var(--border))' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid hsl(var(--border))' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((it, idx) => (
            <tr key={idx}>
              <td style={{ padding: 8 }}>{it.description}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>₹{it.rate.toLocaleString()}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{it.quantity}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>₹{(it.rate * it.quantity).toLocaleString()}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} style={{ padding: 8, textAlign: 'right', fontWeight: 600 }}>Subtotal</td>
            <td style={{ padding: 8, textAlign: 'right' }}>₹{getBillSubtotal(bill).toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ padding: 8, textAlign: 'right', fontWeight: 600 }}>GST ({bill.gstRate}%)</td>
            <td style={{ padding: 8, textAlign: 'right' }}>₹{getGstAmount(bill).toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ padding: 8, textAlign: 'right', fontWeight: 700 }}>Grand Total</td>
            <td style={{ padding: 8, textAlign: 'right', fontWeight: 700 }}>₹{getGrandTotal(bill).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 24, fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Terms & Conditions</div>
        <div>Goods once sold will not be taken back. Payment due upon receipt unless otherwise agreed.</div>
        <div style={{ marginTop: 12 }}>Thank you for your business!</div>
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
        Tallyfixr Pvt. Ltd., 123 Business Park, Pune, MH
      </div>
    </div>
  );
});

export default InvoicePreview;
