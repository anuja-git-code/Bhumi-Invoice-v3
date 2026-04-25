import { useState, useEffect } from "react";

const SUPABASE_URL = "https://cbnqkgtdrbealwofusqx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibnFrZ3RkcmJlYWx3b2Z1c3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDUxMTQsImV4cCI6MjA4ODI4MTExNH0.laWJhIy84KxPfBRHDOR7kVkPemDB8vdZjUV5ktq-lBw";

function Ledger() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/invoices?order=created_at.desc`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setInvoices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ padding: "30px" }}>Loading...</h2>;
  if (invoices.length === 0) return <h2 style={{ padding: "30px", textAlign: "center" }}>No invoices found.</h2>;

  return (
    <div style={{ padding: "40px", background: "#f3f4f6", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Invoice Ledger</h1>
      {invoices.map((inv) => (
        <div key={inv.id} style={{ background: "white", padding: "30px", marginBottom: "30px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ marginBottom: "20px" }}>
            <h3>Billed To</h3>
            <p><strong>Name:</strong> {inv.customer?.name || "N/A"}</p>
            <p><strong>Address:</strong> {inv.customer?.address || "N/A"}</p>
            <p><strong>GST No:</strong> {inv.customer?.gstin || inv.customer?.gst || "N/A"}</p>
            <p><strong>Date:</strong> {new Date(inv.created_at).toLocaleDateString()}</p>
          </div>
          <table border="1" cellPadding="10" width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN</th>
                <th>Rate</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(inv.items || []).map((item, i) => (
                <tr key={i}>
                  <td>{item.desc}</td>
                  <td>{item.hsn}</td>
                  <td>₹{Number(item.rate).toFixed(2)}</td>
                  <td>{item.qty}</td>
                  <td>₹{Number(item.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <p>Subtotal: ₹{Number(inv.totals?.total || 0).toFixed(2)}</p>
            <p>SGST: ₹{Number(inv.totals?.sgst || 0).toFixed(2)}</p>
            <p>CGST: ₹{Number(inv.totals?.cgst || 0).toFixed(2)}</p>
            <h2 style={{ color: "blue" }}>Grand Total: ₹{Number(inv.totals?.grand || 0).toFixed(2)}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Ledger;
