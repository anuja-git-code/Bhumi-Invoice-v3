import { useState, useEffect } from "react";
import { API_BASE_URL } from "../api";

function Ledger() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/invoices`)
      .then(res => res.json())
      .then(data => {
        setInvoices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ padding: "30px" }}>Loading...</h2>;

  return (
    <div style={{ padding: "40px", background: "#f3f4f6", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Invoice Ledger</h1>

      {invoices.map((inv) => (
        <div
          key={inv._id}
          style={{
            background: "white",
            padding: "30px",
            marginBottom: "30px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          {/* Customer Section */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Billed To</h3>

            <p><strong>Name:</strong> {inv.customer?.name || "N/A"}</p>

            <p><strong>Address:</strong> {inv.customer?.address || "N/A"}</p>

            <p><strong>GST No:</strong> {inv.customer?.gst || "N/A"}</p>

            <p><strong>HSN Code:</strong> {inv.customer?.hsn || "39232990"}</p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(inv.date).toLocaleDateString()}
            </p>
          </div>

          {/* Table */}
          <table
            border="1"
            cellPadding="10"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
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
              {inv.items?.map((item, i) => (
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

          {/* Totals */}
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <p>Subtotal: ₹{Number(inv.totals?.total || 0).toFixed(2)}</p>
            <p>SGST: ₹{Number(inv.totals?.sgst || 0).toFixed(2)}</p>
            <p>CGST: ₹{Number(inv.totals?.cgst || 0).toFixed(2)}</p>

            <h2 style={{ color: "blue" }}>
              Grand Total: ₹{Number(inv.totals?.grand || 0).toFixed(2)}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Ledger;
