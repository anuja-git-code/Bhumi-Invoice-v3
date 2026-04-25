const mongoose = require("mongoose");
const cors = require("cors");
const corsMiddleware = cors({ origin: "*" });

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

const invoiceSchema = new mongoose.Schema({
  customer: { name: String, address: String, gst: String },
  items: [{ desc: String, hsn: String, rate: Number, qty: Number, total: Number }],
  totals: { total: Number, sgst: Number, cgst: Number, grand: Number }
}, { timestamps: true });

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

module.exports = async (req, res) => {
  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (result) => {
      if (result instanceof Error) reject(result);
      resolve(result);
    });
  });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectDB();

  const url = req.url.replace(/\?.*$/, "");

  if (req.method === "POST" && url === "/save-invoice") {
    try {
      const { customer, items, totals } = req.body;
      const newInvoice = new Invoice({
        customer: {
          name: customer?.name || "",
          address: customer?.address || "",
          gst: customer?.gstin || ""
        },
        items: (items || []).map(item => ({
          desc: item.desc || "",
          hsn: item.hsn || "39232990",
          rate: Number(item.rate) || 0,
          qty: Number(item.qty) || 0,
          total: Number(item.total) || 0
        })),
        totals: {
          total: Number(totals?.total) || 0,
          sgst: Number(totals?.sgst) || 0,
          cgst: Number(totals?.cgst) || 0,
          grand: Number(totals?.grand) || 0
        }
      });
      await newInvoice.save();
      return res.status(201).json({ message: "Invoice saved successfully", invoice: newInvoice });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET" && url === "/invoices") {
    try {
      const invoices = await Invoice.find().sort({ createdAt: -1 });
      return res.json(invoices);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(404).json({ error: "Not found" });
};
