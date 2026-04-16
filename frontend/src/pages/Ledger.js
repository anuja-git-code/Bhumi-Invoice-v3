import { useState, useEffect } from "react";
import { API_BASE_URL } from "../api";

function Ledger() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!API_BASE_URL) {
      console.error("Backend URL is not configured.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/invoices`)
      .then(res => res.json())
      .then(data => {
        setInvoices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching invoices:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ padding: "40px", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" }}>
      <div className="spinner"></div>
    </div>
  );
  
  if (invoices.length === 0) return (
    <div style={{ padding: "40px", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb", color: "#475569", fontFamily: "'Inter', sans-serif" }}>
      <h2>No invoices found.</h2>
    </div>
  );

  return (
    <div style={{ padding: "60px 20px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f3f4f6", minHeight: "100vh", color: "#0f172a" }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          .invoice-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border-radius: 8px;
            transition: box-shadow 0.2s ease, transform 0.2s ease;
          }
          
          .invoice-card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
            transform: translateY(-2px);
          }

          .table-row {
            transition: background-color 0.15s ease;
          }
          .table-row:hover {
            background-color: #f8fafc;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-radius: 50%;
            border-top-color: #2563eb;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
        <h2 style={{ margin: "0", fontSize: "32px", fontWeight: "700", color: "#1e293b", letterSpacing: "-0.5px" }}>
          Invoice Ledger
        </h2>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "40px", alignItems: "center" }}>
        {invoices.map((inv) => (
          <div key={inv._id} className="invoice-card" style={{
            width: "100%",
            maxWidth: "960px",
            overflow: "hidden",
          }}>
            {/* Header / Customer Details */}
            <div style={{ padding: "40px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", backgroundColor: "#ffffff" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Billed To</h3>
                <p style={{ margin: "0 0 6px 0", fontWeight: "600", fontSize: "18px", color: "#0f172a" }}>{inv.customer?.name || "N/A"}</p>
                <p style={{ margin: "0", color: "#475569", fontSize: "14px", lineHeight: "1.5" }}>{inv.customer?.address || "No address provided"}</p>
              </div>
              <div style={{ textAlign: "right", flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Invoice Protocol</h3>
                <p style={{ margin: "0 0 6px 0", color: "#475569", fontSize: "14px" }}>Date: <span style={{ color: "#0f172a", fontWeight: "500", marginLeft: "6px" }}>{new Date(inv.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span></p>
                <p style={{ margin: "0", color: "#475569", fontSize: "14px" }}>Reference No: <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "6px" }}>#{inv._id.slice(-6).toUpperCase()}</span></p>
              </div>
            </div>

            {/* Items Table */}
            <div style={{ padding: "0 40px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>HSN Code</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Rate</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Quantity</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.items?.map((item, idx) => (
                    <tr key={idx} className="table-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{...tdStyle, fontWeight: "500", color: "#1e293b"}}>{item.desc}</td>
                      <td style={tdStyle}>{item.hsn}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>₹{Number(item.rate).toFixed(2)}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{item.qty}</td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: "600", color: "#0f172a" }}>₹{Number(item.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div style={{ padding: "30px 40px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "320px" }}>
                <div style={totalRowStyle}>
                  <span style={{ color: "#64748b" }}>Subtotal</span>
                  <span style={{ fontWeight: "500", color: "#334155" }}>₹{Number(inv.totals?.total || 0).toFixed(2)}</span>
                </div>
                <div style={totalRowStyle}>
                  <span style={{ color: "#64748b" }}>SGST (9%)</span>
                  <span style={{ fontWeight: "500", color: "#334155" }}>₹{Number(inv.totals?.sgst || 0).toFixed(2)}</span>
                </div>
                <div style={totalRowStyle}>
                  <span style={{ color: "#64748b" }}>CGST (9%)</span>
                  <span style={{ fontWeight: "500", color: "#334155" }}>₹{Number(inv.totals?.cgst || 0).toFixed(2)}</span>
                </div>
                
                <div style={{ 
                  ...totalRowStyle, 
                  marginTop: "16px", 
                  paddingTop: "16px", 
                  borderTop: "2px solid #cbd5e1",
                  alignItems: "center"
                }}>
                  <span style={{ color: "#0f172a", fontWeight: "600", fontSize: "16px" }}>Grand Total</span>
                  <span style={{ color: "#2563eb", fontWeight: "700", fontSize: "24px" }}>
                    ₹{Number(inv.totals?.grand || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const thStyle = { 
  padding: "16px 12px", 
  textAlign: "left", 
  color: "#64748b", 
  fontWeight: "600", 
  fontSize: "12px",
  borderBottom: "2px solid #e2e8f0"
};

const tdStyle = { 
  padding: "16px 12px", 
  color: "#475569", 
  fontSize: "14px" 
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
  fontSize: "14px"
};

export default Ledger;

