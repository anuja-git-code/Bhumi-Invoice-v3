import { useState } from "react";
import { API_BASE_URL } from "../api";

function Invoice() {

  const [items, setItems] = useState([
    { desc: "", hsn: "", rate: "", qty: "", total: "" }
  ]);

 const [customer, setCustomer] = useState({
  name: "",
  address: "",
  gst: "",
  hsn: "39232990"
});

  const backendUrl = API_BASE_URL;

  const handlePrint = () => window.print();

  const handleChange = (i, e) => {
    const newItems = [...items];
    newItems[i][e.target.name] = e.target.value;
    newItems[i].total = newItems[i].rate * newItems[i].qty;
    setItems(newItems);
  };

  const addRow = () => {
    setItems([...items, { desc: "", hsn: "", rate: "", qty: "", total: "" }]);
  };

  const total = items.reduce((sum, i) => sum + Number(i.total || 0), 0);
  const sgst = total * 0.09;
  const cgst = total * 0.09;
  const grand = total + sgst + cgst;

  const handleSave = async () => {
    if (!backendUrl) {
      alert("Save is unavailable on GitHub Pages because the backend is not hosted. Run the app locally with the backend or deploy the backend and set REACT_APP_API_URL.");
      return;
    }

    try {
      const payload = {
        customer,
        items,
        totals: { total, sgst, cgst, grand }
      };
      const response = await fetch(`${backendUrl}/save-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        alert("Invoice saved successfully!");
      } else {
        alert("Failed to save invoice: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Error saving invoice");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "10px" }}>

      {/* PRINT FIX */}
      <style>
        {`
        @media print {
          button { display:none }
          input { border:none; outline:none }
          input::placeholder { color:transparent }
          table { border-collapse:collapse }
          td, th { border:1px solid black; padding:6px }
        }
      `}
      </style>

      {/* MAIN BORDER */}
      <div style={{ border: "2px solid black" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", borderBottom: "1px solid black", padding: "5px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>Tax invoice</div>
          <div style={{ fontSize: "11px" }}>ISSUE OF INVOICE UNDER GST 2017</div>

          <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "5px" }}>
            BHUMI POLYMERS
          </div>

          <div style={{ fontSize: "13px" }}>
            ‘Shrikant’ Shastrinagar, Road no 6, Islampur, Sangli. 415409
          </div>

          <div style={{ fontSize: "12px" }}>
            GST No : 27BSOPP5866N1ZL, Ph : 8208460013, 9004007751 Email : bhumipolymer@gmail.com
          </div>
        </div>

        {/* INVOICE ROW */}
        <div style={{ display: "flex", borderBottom: "1px solid black" }}>
          <div style={{ width: "50%", padding: "5px", borderRight: "1px solid black" }}>
            Invoice No : <b>BPI24/25-00492</b>
          </div>
          <div style={{ width: "50%", padding: "5px", textAlign: "right" }}>
            Date of issue: <b>{new Date().toLocaleDateString()}</b>
          </div>
        </div>

        {/* CONSIGNEE */}
        <div style={{ borderBottom: "1px solid black" }}>
          <div style={{ background: "black", color: "white", padding: "5px", fontWeight: "bold" }}>
            Details of consignee
          </div>

          <div style={{ display: "flex" }}>
            <div style={{ width: "60%", padding: "8px" }}>
              <p><b>Name :</b> <input value={customer.name} onChange={(e)=>setCustomer({...customer,name:e.target.value})} /></p>
              <p><b>Address :</b> <input value={customer.address} onChange={(e)=>setCustomer({...customer,address:e.target.value})} /></p>
              <p>
  <b>G.S.T.N :</b>
  <input
    value={customer.gst}
    onChange={(e)=>setCustomer({...customer,gst:e.target.value})}
  />
</p>
            </div>

            <div style={{ width: "40%", borderLeft: "1px solid black", padding: "8px" }}>
              <p><b>Ref. No. and date :</b> -</p>
              <p><b>Payment Terms :</b> Advance</p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <table width="100%">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>Sr. No</th>
              <th style={{ width: "45%" }}>Description of Goods / Services</th>
              <th style={{ width: "15%" }}>HSN/SAC</th>
              <th style={{ width: "10%" }}>Rate / Unit</th>
              <th style={{ width: "10%" }}>Qty (Nos)</th>
              <th style={{ width: "15%" }}>Total (Rs.)</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>

                <td><input name="desc" onChange={(e)=>handleChange(i,e)} /></td>
            <td>39232990</td>
          <td><input name="rate" onChange={(e)=>handleChange(i,e)} /></td>
                <td><input name="qty" onChange={(e)=>handleChange(i,e)} /></td>

                <td>{item.total || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addRow}>Add Item</button>

        {/* TOTAL + DECLARATION */}
        <table width="100%">
          <tbody>

            <tr>
              <td rowSpan="4" style={{ width: "60%" }}>
                <b>Declaration</b> Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from buyer.
              </td>
              <td>Total</td>
              <td>{total}</td>
            </tr>

            <tr>
              <td>SGST (9%)</td>
              <td>{sgst}</td>
            </tr>

            <tr>
              <td>CGST (9%)</td>
              <td>{cgst}</td>
            </tr>

            <tr>
              <td><b>TOTAL (After GST)</b></td>
              <td><b>{grand}</b></td>
            </tr>

            <tr>
              <td colSpan="3">
                <b>Grand Total Rs. (In Words):</b> {Math.round(grand)} only
              </td>
            </tr>

          </tbody>
        </table>

        {/* BANK */}
        <table width="50%">
          <tbody>
            <tr><td>Bank Name</td><td>HDFC Bank</td></tr>
            <tr><td>Branch</td><td>Uran Islampur</td></tr>
            <tr><td>A/C No. & Type</td><td>50200036363595 Current</td></tr>
            <tr><td>IFSC Code</td><td>HDFC0002455</td></tr>
          </tbody>
        </table>

        {/* SIGN */}
        <div style={{ textAlign: "right", padding: "20px" }}>
          For BHUMI POLYMERS<br /><br /><br />
          Authorized Signatory
        </div>

      </div>

      <button onClick={handlePrint} style={{ marginTop: "10px" }}>
        Print Invoice
      </button>

      <button onClick={handleSave} style={{ marginTop: "10px", marginLeft: "10px", padding: "5px 10px", cursor: "pointer" }}>
        Save Invoice
      </button>

    </div>
  );
}

export default Invoice;
