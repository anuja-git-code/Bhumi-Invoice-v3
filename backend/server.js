const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.options("*", cors({ origin: "*" }));

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB connected");
}).catch((err) => console.error("MongoDB error:", err));

const invoiceSchema = new mongoose.Schema({
  customer: {
    name: String,
    address: String,
    gst: String,
    hsn: String
  },
  items: [{
    desc: String,
    hsn: String,
    rate: Number,
    qty: Number,
    total: Number
  }],
  totals: {
    total: Number,
    sgst: Number,
    cgst: Number,
    grand: Number
  }
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

app.post("/save-invoice", async (req, res) => {
  try {
    const { customer, items, totals } = req.body;
    const cleanItems = items.map((item) => ({
      desc: item.desc || "",
      hsn: "39232990",
      rate: Number(item.rate) || 0,
      qty: Number(item.qty) || 0,
      total: Number(item.total) || 0
    }));
    const newInvoice = new Invoice({
      customer: {
        name: customer.name || "",
        address: customer.address || "",
        gst: customer.gst || "",
        hsn: "39232990"
      },
      items: cleanItems,
      totals: {
        total: Number(totals.total) || 0,
        sgst: Number(totals.sgst) || 0,
        cgst: Number(totals.cgst) || 0,
        grand: Number(totals.grand) || 0
      }
    });
    await newInvoice.save();
    res.status(201).json({ message: "Invoice saved successfully", invoice: newInvoice });
  } catch (err) {
    console.error("REAL SAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
