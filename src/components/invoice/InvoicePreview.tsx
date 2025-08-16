import { forwardRef } from "react";
import logo from "@/assets/logo-mark.png";
import { Bill } from "@/types";

interface Props {
  bill: Bill;
}

const InvoicePreview = forwardRef<HTMLDivElement, Props>(({ bill }, ref) => {
  const { subtotal, gst, total } = bill.totals;
  const { companyName, gstin, address: companyAddress, phone: companyPhone } = bill.user;
  const { name, address, phone, gstNumber } = bill.customer;

  return (
    <div 
      ref={ref || null} 
      style={{ 
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif', 
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        color: '#000'
      }}
    >
      {/* Header section with company details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <img src={logo} alt="Company logo" style={{ height: '50px' }} />
            <div style={{ fontWeight: 700, fontSize: '20px' }}>{companyName}</div>
          </div>
          
          <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
            <div>{companyAddress}</div>
            {companyPhone && <div>Phone: {companyPhone}</div>}
            <div>GSTIN: {gstin}</div>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>INVOICE</div>
          <div style={{ fontSize: '12px' }}>#{bill.billNumber}</div>
          <div style={{ fontSize: '12px' }}>Date: {new Date(bill.date).toLocaleDateString()}</div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

      {/* Bill to and payment info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Bill To:</div>
          <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
            <div style={{ fontWeight: 500 }}>{name}</div>
            {address && <div>{address}</div>}
            {phone && <div>Phone: {phone}</div>}
            {gstNumber && <div>GST: {gstNumber}</div>}
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Payment Info:</div>
          <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
            <div>Status: <span style={{ textTransform: 'capitalize' }}>{bill.paymentStatus}</span></div>
            {bill.paymentMethod && <div>Method: {bill.paymentMethod}</div>}
            <div>Due Date: {new Date(bill.date).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginBottom: '24px',
        fontSize: '12px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <th style={{ 
              textAlign: 'left', 
              padding: '8px 12px', 
              borderBottom: '1px solid #e2e8f0',
              fontWeight: 600
            }}>Description</th>
            <th style={{ 
              textAlign: 'right', 
              padding: '8px 12px', 
              borderBottom: '1px solid #e2e8f0',
              fontWeight: 600
            }}>Rate</th>
            <th style={{ 
              textAlign: 'right', 
              padding: '8px 12px', 
              borderBottom: '1px solid #e2e8f0',
              fontWeight: 600
            }}>Qty</th>
            <th style={{ 
              textAlign: 'right', 
              padding: '8px 12px', 
              borderBottom: '1px solid #e2e8f0',
              fontWeight: 600
            }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                {item.description}
              </td>
              <td style={{ 
                padding: '12px', 
                borderBottom: '1px solid #e2e8f0',
                textAlign: 'right'
              }}>
                ₹{item.rate.toLocaleString()}
              </td>
              <td style={{ 
                padding: '12px', 
                borderBottom: '1px solid #e2e8f0',
                textAlign: 'right'
              }}>
                {item.quantity}
              </td>
              <td style={{ 
                padding: '12px', 
                borderBottom: '1px solid #e2e8f0',
                textAlign: 'right'
              }}>
                ₹{(item.rate * item.quantity).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals section */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '300px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ fontWeight: 500 }}>Subtotal</div>
            <div>₹{subtotal.toLocaleString()}</div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ fontWeight: 500 }}>GST ({bill.gstRate}%)</div>
            <div>₹{gst.toLocaleString()}</div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#f8fafc',
            fontWeight: 600
          }}>
            <div>Total</div>
            <div>₹{total.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {bill.notes && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>Notes</div>
          <div style={{ fontSize: '12px' }}>{bill.notes}</div>
        </div>
      )}

      {/* Terms and conditions */}
      <div style={{ marginTop: '32px', fontSize: '12px' }}>
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>Terms & Conditions</div>
        <div>
          <p style={{ marginBottom: '4px' }}>1. Payment is due within 15 days of invoice date.</p>
          <p style={{ marginBottom: '4px' }}>2. Please make checks payable to {companyName}.</p>
          <p>3. Thank you for your business!</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '48px',
        paddingTop: '12px',
        borderTop: '1px solid #e2e8f0',
        fontSize: '10px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        <div>{companyName} • {companyAddress} • GSTIN: {gstin}</div>
        <div style={{ marginTop: '4px' }}>This is a computer generated invoice and does not require a signature.</div>
      </div>
    </div>
  );
});

InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;