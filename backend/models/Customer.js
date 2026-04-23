const mongoose = require("mongoose");

function generateGST() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";

  const random = (set, len) =>
    Array.from({ length: len }, () => set[Math.floor(Math.random() * set.length)]).join("");

  return (
    "27" +                 // Maharashtra state code
    random(chars, 5) +
    random(nums, 4) +
    random(chars, 1) +
    "1Z" +
    random(nums, 1)
  );
}

const customerSchema = new mongoose.Schema({
  customerName: String,

  gstNo: {
    type: String,
    default: generateGST
  },

  hsnCode: {
    type: String,
    default: "39232990"
  }
});

module.exports = mongoose.model("Customer", customerSchema);
