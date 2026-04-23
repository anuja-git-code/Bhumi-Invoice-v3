import { useState } from "react";
import { API_BASE_URL } from "../api";

function Customers() {
  const generateGST = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";

    const random = (set, len) =>
      Array.from({ length: len }, () => set[Math.floor(Math.random() * set.length)]).join("");

    return (
      "27" +
      random(chars, 5) +
      random(nums, 4) +
      random(chars, 1) +
      "1Z" +
      random(nums, 1)
    );
  };

  const [form, setForm] = useState({
    name: "",
    address: "",
    gst: generateGST(),
    phone: "",
    hsn: "39232990"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/save-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Customer saved successfully!");

        setForm({
          name: "",
          address: "",
          gst: generateGST(),
          phone: "",
          hsn: "39232990"
        });
      } else {
        alert("Failed to save customer");
      }
    } catch (error) {
      alert("Error saving customer");
    }
  };

  return (
    <div className="container">
      <div className="page-card">
        <h2>Add Customer</h2>

        <input type="text" name="name" placeholder="Customer Name" value={form.name} onChange={handleChange} />
        <br /><br />

        <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <br /><br />

        <input type="text" name="gst" value={form.gst} readOnly />
        <br /><br />

        <input type="text" name="hsn" value={form.hsn} readOnly />
        <br /><br />

        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
        <br /><br />

        <button onClick={handleSubmit}>Save Customer</button>
      </div>
    </div>
  );
}

export default Customers;
