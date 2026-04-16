import { useState } from "react";
import { API_BASE_URL } from "../api";

function Customers() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    gst: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!API_BASE_URL) {
      alert("Save is unavailable on GitHub Pages because the backend is not hosted. Configure REACT_APP_API_URL to your hosted backend URL or use the app locally.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/save-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok) {
        alert("Customer saved successfully!");
        setForm({ name: "", address: "", gst: "", phone: "" });
      } else {
        alert("Failed to save customer: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Error saving customer");
    }
  };

  return (
    <div className="container">
      <div className="page-card">
        <h2 className="page-title">Add Customer</h2>
        <p className="page-note">Add customer details here and save them to your billing database.</p>

        <input
          className="form-field"
          type="text"
          name="name"
          value={form.name}
          placeholder="Customer Name"
          onChange={handleChange}
        />
        <div style={{ height: 18 }} />

        <input
          className="form-field"
          type="text"
          name="address"
          value={form.address}
          placeholder="Address"
          onChange={handleChange}
        />
        <div style={{ height: 18 }} />

        <input
          className="form-field"
          type="text"
          name="gst"
          value={form.gst}
          placeholder="GST Number"
          onChange={handleChange}
        />
        <div style={{ height: 18 }} />

        <input
          className="form-field"
          type="text"
          name="phone"
          value={form.phone}
          placeholder="Phone Number"
          onChange={handleChange}
        />

        <div className="form-actions">
          <button className="cta-button" onClick={handleSubmit}>Save Customer</button>
        </div>
      </div>
    </div>
  );
}

export default Customers;