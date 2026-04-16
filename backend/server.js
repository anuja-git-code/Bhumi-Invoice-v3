const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Invoice = require("./models/Invoice");
const Customer = require("./models/Customer");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/billing-system")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));

app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

app.post("/save-invoice", async (req, res) => {
  try {
    const { customer, items, totals } = req.body;
    const newInvoice = new Invoice({ customer, items, totals });
    await newInvoice.save();
    console.log("Invoice Saved ✅", newInvoice._id);
    res.status(201).json({ message: "Data saved successfully ✅", invoice: newInvoice });
  } catch (err) {
    console.error("Save Error ❌", err);
    res.status(500).json({ error: "Failed to save data ❌" });
  }
});

app.post("/save-customer", async (req, res) => {
  try {
    const { name, address, gst, phone } = req.body;
    const newCustomer = new Customer({ name, address, gst, phone });
    await newCustomer.save();
    console.log("Customer Saved ✅", newCustomer._id);
    res.status(201).json({ message: "Customer saved successfully ✅", customer: newCustomer });
  } catch (err) {
    console.error("Customer Save Error ❌", err);
    res.status(500).json({ error: "Failed to save customer ❌" });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ date: -1 });
    res.status(200).json(customers);
  } catch (err) {
    console.error("Fetch Error ❌", err);
    res.status(500).json({ error: "Failed to fetch customers ❌" });
  }
});

app.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    console.error("Fetch Error ❌", err);
    res.status(500).json({ error: "Failed to fetch data ❌" });
  }
});

app.get("/view-invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    let html = `
      <html>
      <head>
        <title>Saved Invoices</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Saved Invoices Ledger</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Items Detail</th>
              <th>Total Amount</th>
              <th>SGST</th>
              <th>CGST</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          <tbody>
    `;

    invoices.forEach(inv => {
      const dateStr = new Date(inv.date).toLocaleString();
      const customerName = inv.customer?.name || "N/A";
      
      let itemsList = "<ul>";
      inv.items.forEach(item => {
        itemsList += `<li>${item.qty}x ${item.desc} (₹${item.total})</li>`;
      });
      itemsList += "</ul>";

      const total = inv.totals?.total?.toFixed(2) || "0.00";
      const sgst = inv.totals?.sgst?.toFixed(2) || "0.00";
      const cgst = inv.totals?.cgst?.toFixed(2) || "0.00";
      const grand = inv.totals?.grand?.toFixed(2) || "0.00";

      html += `
        <tr>
          <td>${dateStr}</td>
          <td>${customerName}</td>
          <td>${itemsList}</td>
          <td>₹${total}</td>
          <td>₹${sgst}</td>
          <td>₹${cgst}</td>
          <td><strong>₹${grand}</strong></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (err) {
    console.error("Fetch Error ❌", err);
    res.status(500).send("Error generating table");
  }
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
}

module.exports = app;