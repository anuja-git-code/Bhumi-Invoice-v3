import { useState } from "react";

const SUPABASE_URL = "https://cbnqkgtdrbealwofusqx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibnFrZ3RkcmJlYWx3b2Z1c3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDUxMTQsImV4cCI6MjA4ODI4MTExNH0.laWJhIy84KxPfBRHDOR7kVkPemDB8vdZjUV5ktq-lBw";

const toWords = (num) => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (num === 0) return "Zero";
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  };
  const rounded = Math.round(num);
  return convert(rounded) + " Only";
};
const EditInput = ({ value, onChange, placeholder, style = {} }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="edit-input"
    style={style}
  />
);

function Invoice() {
  const [items, setItems] = useState([
    { desc: "", hsn: "39232990", rate: "", qty: "", total: "" }
  ]);
  const [customer, setCustomer] = useState({
    name: "", address: "", state: "", stateCode: "27", gstin: ""
  });
  const [invoiceNo, setInvoiceNo] = useState("848");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString("en-IN"));
  const [poNo, setPoNo] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [roundOff, setRoundOff] = useState("");

  const isMaharashtra = customer.stateCode.trim() === "27";

  const handlePrint = () => window.print();

  const handleChange = (i, e) => {
    const newItems = [...items];
    newItems[i][e.target.name] = e.target.value;
    const r = parseFloat(newItems[i].rate) || 0;
    const q = parseFloat(newItems[i].qty) || 0;
    newItems[i].total = r * q || "";
    setItems(newItems);
  };

  const addRow = () =>
    setItems([...items, { desc: "", hsn: "39232990", rate: "", qty: "", total: "" }]);

  const removeRow = (i) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== i));
  };

  const total = items.reduce((s, i) => s + Number(i.total || 0), 0);
  const roundOffVal = parseFloat(roundOff) || 0;

  const cgst = isMaharashtra ? total * 0.09 : 0;
  const sgst = isMaharashtra ? total * 0.09 : 0;
  const igst = !isMaharashtra ? total * 0.18 : 0;
  const grand = total + cgst + sgst + igst - roundOffVal;

  const handleSave = async () => {
    try {
      const payload = {
        customer,
        items,
        totals: { total, cgst, sgst, igst, roundOff: roundOffVal, grand }
      };
      const res = await fetch(`${SUPABASE_URL}/rest/v1/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Invoice saved successfully!");
      } else {
        const err = await res.json();
        alert("Error: " + (err.message || JSON.stringify(err)));
      }
    } catch (e) {
      alert("Error saving invoice: " + e.message);
    }
  };

  return (
    <div className="invoice-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        .invoice-wrapper { font-family: 'Source Sans 3', Arial, sans-serif; font-size: 13px; background: #e8e0d5; min-height: 100vh; padding: 20px; color: #1a1a1a; }
        .action-bar { display: flex; gap: 10px; margin-bottom: 16px; justify-content: center; flex-wrap: wrap; }
        .action-btn { padding: 9px 22px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.15s; letter-spacing: 0.3px; }
        .btn-print { background: #1a3a5c; color: white; }
        .btn-save { background: #2e7d32; color: white; }
        .btn-add { background: #6d4c41; color: white; }
        .invoice-doc { max-width: 860px; margin: 0 auto; background: #fff; border: 2px solid #1a1a1a; }
        .inv-header { display: flex; align-items: stretch; border-bottom: 2px solid #1a1a1a; }
        .inv-header-left { padding: 10px 14px; border-right: 2px solid #1a1a1a; min-width: 160px; display: flex; flex-direction: column; justify-content: center; }
        .tax-invoice-label { border: 2px solid #1a1a1a; display: inline-block; padding: 2px 8px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; margin-bottom: 4px; }
        .gst-sub { font-size: 10px; color: #444; line-height: 1.3; }
        .gst-number { margin-top: 8px; font-size: 11px; font-weight: 600; }
        .inv-header-center { flex: 1; padding: 10px 16px; text-align: center; display: flex; flex-direction: column; justify-content: center; border-right: 2px solid #1a1a1a; }
        .company-logo-row { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .bp-logo { width: 42px; height: 42px; background: #1a3a5c; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: 900; font-family: 'EB Garamond', serif; flex-shrink: 0; }
        .company-name { font-family: 'EB Garamond', serif; font-size: 32px; font-weight: 700; letter-spacing: 1px; color: #1a1a1a; line-height: 1; }
        .company-addr { font-size: 11px; color: #333; margin-top: 4px; line-height: 1.5; }
        .inv-header-right { min-width: 160px; padding: 10px 14px; display: flex; flex-direction: column; justify-content: center; gap: 6px; font-size: 12px; }
        .inv-meta-row { display: flex; align-items: center; gap: 4px; }
        .inv-meta-label { font-weight: 600; white-space: nowrap; }
        .receiver-row { display: flex; border-bottom: 1px solid #1a1a1a; }
        .receiver-section-title { background: #d0d8e4; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; padding: 3px 8px; text-transform: uppercase; border-bottom: 1px solid #1a1a1a; }
        .receiver-left { flex: 1; border-right: 1px solid #1a1a1a; }
        .receiver-right { width: 200px; }
        .receiver-fields { padding: 6px 10px; display: flex; flex-direction: column; gap: 6px; }
        .field-row { display: flex; align-items: center; gap: 4px; font-size: 12px; }
        .field-label { font-weight: 600; white-space: nowrap; min-width: 70px; }
        .gstin-input { border: none; border-bottom: 1px dashed #aaa; outline: none; background: transparent; font-family: monospace; font-size: 12px; font-weight: 600; letter-spacing: 2px; width: 100%; padding: 2px 4px; text-transform: uppercase; }
        .gstin-input:focus { border-bottom: 1px solid #1a3a5c; }
        .items-table { width: 100%; border-collapse: collapse; border-bottom: 1px solid #1a1a1a; table-layout: fixed; border: 1px solid #1a1a1a; }
        .items-table th { background: #d0d8e4; border: 1px solid #1a1a1a; padding: 6px 8px; text-align: center; font-size: 12px; font-weight: 700; }
        .items-table td { border: 1px solid #1a1a1a; padding: 4px 6px; text-align: center; vertical-align: middle; font-size: 12px; height: 32px; }
        .items-table td.desc-cell { text-align: left; }
        .items-table tbody tr { height: 48px; }
        .bottom-section { display: flex; border-bottom: 1px solid #1a1a1a; }
        .declaration-block { flex: 1; border-right: 1px solid #1a1a1a; padding: 8px 10px; font-size: 11px; color: #333; line-height: 1.5; }
        .declaration-block b { font-size: 12px; color: #1a1a1a; }
        .declaration-block { min-height: 160px; }
        .grand-total-words { margin-top: 8px; font-size: 11.5px; font-weight: 600; color: #1a1a1a; }
        .totals-block { width: 280px; }
        .totals-table { width: 100%; border-collapse: collapse; }
        .totals-table td { border-bottom: 1px solid #1a1a1a; padding: 5px 10px; font-size: 12px; }
        .totals-table td:last-child { border-left: 1px solid #1a1a1a; text-align: right; font-weight: 600; min-width: 90px; }
        .totals-table tr:last-child td { border-bottom: none; }
        .grand-total-row td { background: #d0d8e4; font-weight: 700 !important; font-size: 13px !important; }
        .footer-row { display: flex; border-bottom: 1px solid #1a1a1a; }
        .bank-block { flex: 1; border-right: 1px solid #1a1a1a; padding: 8px 10px; }
        .bank-title { font-weight: 700; font-size: 12px; margin-bottom: 4px; border-bottom: 1px solid #ccc; padding-bottom: 3px; }
        .bank-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
        .bank-table td { padding: 2px 4px; }
        .bank-table td:first-child { font-weight: 600; width: 110px; }
        .bank-table td:first-child::after { content: ":"; }
        .charges-note { font-size: 10.5px; color: #555; margin-top: 6px; line-height: 1.4; }
        .sign-block { width: 220px; padding: 10px 14px; text-align: right; display: flex; flex-direction: column; justify-content: space-between; }
        .cust-sign { font-size: 11px; color: #555; }
        .for-company { font-size: 13px; font-weight: 700; margin-top: 40px; }
        .auth-sign { font-size: 11px; color: #555; margin-top: 4px; }
        .edit-input { border: none; border-bottom: 1px dashed #aaa; outline: none; background: transparent; font-family: inherit; font-size: inherit; color: inherit; padding: 1px 2px; width: 100%; min-width: 40px; }
        .edit-input:focus { border-bottom: 1px solid #1a3a5c; background: rgba(26,58,92,0.04); }
        .edit-input::placeholder { color: #bbb; font-style: italic; }
        .table-input { border: none; outline: none; background: transparent; font-family: inherit; font-size: 12px; color: inherit; padding: 0; width: 100%; text-align: center; }
        .table-input::placeholder { color: #ccc; }
        .desc-input { text-align: left; }
        .remove-btn { background: none; border: none; color: #c62828; cursor: pointer; font-size: 14px; padding: 0 2px; line-height: 1; opacity: 0.6; }
        .remove-btn:hover { opacity: 1; }
        .roundoff-input { border: none; border-bottom: 1px dashed #aaa; outline: none; background: transparent; font-size: 12px; width: 70px; text-align: right; font-family: inherit; }
        @media print {
          body { background: white !important; }
          .invoice-wrapper { background: white !important; padding: 0 !important; }
          .action-bar { display: none !important; }
          .edit-input { border: none !important; border-bottom: none !important; }
          .table-input { border: none !important; }
          .gstin-input { border: none !important; letter-spacing: 3px; }
          .remove-btn { display: none !important; }
          .roundoff-input { border: none !important; }
          .invoice-doc { border: 2px solid black !important; }
        }
      `}</style>

      <div className="action-bar">
        <button className="action-btn btn-add" onClick={addRow}>+ Add Item</button>
        <button className="action-btn btn-save" onClick={handleSave}>💾 Save Invoice</button>
        <button className="action-btn btn-print" onClick={handlePrint}>🖨️ Print Invoice</button>
      </div>

      <div className="invoice-doc">
        {/* HEADER */}
        <div className="inv-header">
          <div className="inv-header-left">
            <div className="tax-invoice-label">TAX INVOICE</div>
            <div className="gst-sub">ISSUE OF INVOICE<br />UNDER GST 2017</div>
            <div className="gst-number">GST No : 27BSOPP5866N1ZL</div>
          </div>
          <div className="inv-header-center">
            <div className="company-logo-row">
              <div className="bp-logo">B</div>
              <div className="company-name">BHUMI POLYMERS</div>
            </div>
            <div className="company-addr">
              'Shrikant' Shastrinagar, Road No 6, Islampur, Sangli. 415409<br />
              Ph : 8208460013, 9004007751 &nbsp;|&nbsp; Email : bhumipolymer@gmail.com
            </div>
          </div>
            <div className="inv-meta-row">
              <span className="inv-meta-label">PO. No. :</span>
              <EditInput value={poNo} onChange={e => setPoNo(e.target.value)} placeholder="-" style={{ width: "70px" }} />
            </div>
            <div className="inv-meta-row" style={{ fontSize: "11px", color: "#666" }}>Enquiry Date : -</div>
            <div className="inv-meta-row">
              <span className="inv-meta-label">Invoice Date :</span>
              <EditInput value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} placeholder="DD/MM/YYYY" style={{ width: "80px" }} />
            </div>
            <div className="inv-meta-row">
              <span className="inv-meta-label">Vehicle No. :</span>
              <EditInput value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} placeholder="-" style={{ width: "70px" }} />
            </div>
          </div>
        </div>

       {/* RECEIVER + INVOICE META */}
<div style={{ display: "flex", borderBottom: "1px solid #1a1a1a" }}>
  <div style={{ flex: 1, borderRight: "1px solid #1a1a1a" }}>
    <div className="receiver-section-title">Details of Receiver (Billed to)</div>
    <div className="receiver-fields">
      <div className="field-row">
        <span className="field-label">M/s./ Shri.</span>
        <EditInput value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} placeholder="Customer name" />
      </div>
      <div className="field-row">
        <span className="field-label">Address</span>
        <EditInput value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} placeholder="Address" />
      </div>
      <div className="field-row">
        <span className="field-label">State</span>
        <EditInput value={customer.state} onChange={e => setCustomer({ ...customer, state: e.target.value })} placeholder="State" style={{ width: "100px" }} />
        <span style={{ fontWeight: 600, marginLeft: "10px", whiteSpace: "nowrap" }}>State Code :</span>
        <EditInput value={customer.stateCode} onChange={e => setCustomer({ ...customer, stateCode: e.target.value })} placeholder="27" style={{ width: "35px" }} />
      </div>
      <div className="field-row">
        <span className="field-label">GSTIN No.</span>
        <input className="gstin-input" maxLength={15} value={customer.gstin} onChange={e => setCustomer({ ...customer, gstin: e.target.value.toUpperCase() })} placeholder="Enter 15-digit GSTIN" />
      </div>
    </div>
  </div>
  <div style={{ minWidth: "200px", padding: "8px 12px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
    <div className="inv-meta-row"><span className="inv-meta-label">Invoice No. :</span><EditInput value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="848" style={{ width: "70px" }} /></div>
    <div className="inv-meta-row"><span className="inv-meta-label">PO. No. :</span><EditInput value={poNo} onChange={e => setPoNo(e.target.value)} placeholder="-" style={{ width: "70px" }} /></div>
    <div className="inv-meta-row" style={{ color: "#666" }}>Enquiry Date : -</div>
    <div className="inv-meta-row"><span className="inv-meta-label">Invoice Date :</span><EditInput value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} placeholder="DD/MM/YYYY" style={{ width: "80px" }} /></div>
    <div className="inv-meta-row"><span className="inv-meta-label">Vehicle No. :</span><EditInput value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} placeholder="-" style={{ width: "60px" }} /></div>
  </div>
</div>

        {/* ITEMS TABLE */}
        <table className="items-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>Sr.<br />No.</th>
              <th style={{ width: "38%" }}>Description of Service</th>
              <th style={{ width: "14%" }}>HSN Code<br />(GST)</th>
              <th style={{ width: "11%" }}>Rate</th>
              <th style={{ width: "11%" }}>Qty.</th>
              <th style={{ width: "21%" }}>Taxable Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td className="desc-cell">
                  <input className="table-input desc-input" name="desc" value={item.desc} onChange={e => handleChange(i, e)} placeholder="Item description" />
                </td>
                <td>
                  <input className="table-input" name="hsn" value={item.hsn} onChange={e => handleChange(i, e)} placeholder="39232990" />
                </td>
                <td>
                  <input className="table-input" name="rate" value={item.rate} onChange={e => handleChange(i, e)} placeholder="0" type="number" />
                </td>
                <td>
                  <input className="table-input" name="qty" value={item.qty} onChange={e => handleChange(i, e)} placeholder="0" type="number" />
                </td>
                <td>
                  {item.total ? Number(item.total).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}
                  {items.length > 1 && (<button className="remove-btn" onClick={() => removeRow(i)}>×</button>)}
                </td>
              </tr>
            ))}
            {items.length < 7 && Array.from({ length: Math.max(0, 7 - items.length) }).map((_, i) => (
              <tr key={`blank-${i}`} style={{ height: "32px" }}><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS + DECLARATION */}
        <div className="bottom-section">
          <div className="declaration-block">
            <b>Declaration</b>
            <p style={{ margin: "4px 0 0" }}>We declare that this invoice shows the actual price of the goods described and that all particulars are true and Correct</p>
            <div className="grand-total-words">
              Grand Total Rs. (In Words) {grand > 0 ? toWords(Math.round(grand)) : "—"}
            </div>
          </div>
          <div className="totals-block">
            <table className="totals-table">
              <tbody>
                <tr>
                  <td>Total</td>
                  <td>{total > 0 ? total.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}</td>
                </tr>
                <tr>
                  <td>CGST &nbsp; 9 %</td>
                  <td>{isMaharashtra && total > 0 ? cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}</td>
                </tr>
                <tr>
                  <td>SGST &nbsp; 9 %</td>
                  <td>{isMaharashtra && total > 0 ? sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}</td>
                </tr>
                <tr>
                  <td>IGST &nbsp; 18 %</td>
                  <td>{!isMaharashtra && igst > 0 ? igst.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}</td>
                </tr>
                <tr>
                  <td>Round off</td>
                  <td>
                    <input
                      className="roundoff-input"
                      type="number"
                      value={roundOff}
                      onChange={e => setRoundOff(e.target.value)}
                      placeholder="0"
                    />
                  </td>
                </tr>
                <tr className="grand-total-row">
                  <td><b>Grand Total</b></td>
                  <td><b>{grand > 0 ? grand.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}</b></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BANK + SIGN */}
        <div className="footer-row">
          <div className="bank-block">
            <div className="bank-title">Bank Details</div>
            <table className="bank-table">
              <tbody>
                <tr><td>Bank Name</td><td>HDFC Bank</td></tr>
                <tr><td>Branch</td><td>Uran Islampur</td></tr>
                <tr><td>A/C No. &amp; Type</td><td>50200036363595 Current</td></tr>
                <tr><td>IFSC Code</td><td>HDFC0002455</td></tr>
              </tbody>
            </table>
            <div className="charges-note">
              Cheque Return Charges 150/- Rs.<br />
              24% p.a. Interest will be Charged for delayed payment<br />
              All Dispute Subjected to Islampur Jurisdiction
            </div>
          </div>
          <div className="sign-block">
            <div className="cust-sign">Cust. Sign.</div>
            <div>
              <div className="for-company">For, BHUMI POLYMERS</div>
              <div className="auth-sign">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
