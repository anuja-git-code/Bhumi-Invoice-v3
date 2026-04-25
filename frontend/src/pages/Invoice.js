const handleSave = async () => {
  try {
    const payload = {
      customer: customer,
      items: items,
      totals: { total, cgst, sgst, grand }
    };
    const res = await fetch("https://cbnqkgtdrbealwofusqx.supabase.co/rest/v1/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibnFrZ3RkcmJlYWx3b2Z1c3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDUxMTQsImV4cCI6MjA4ODI4MTExNH0.laWJhIy84KxPfBRHDOR7kVkPemDB8vdZjUV5ktq-lBw",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibnFrZ3RkcmJlYWx3b2Z1c3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDUxMTQsImV4cCI6MjA4ODI4MTExNH0.laWJhIy84KxPfBRHDOR7kVkPemDB8vdZjUV5ktq-lBw",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert("Invoice saved successfully!");
    } else {
      const err = await res.json();
      alert("Error: " + (err.message || "Unknown error"));
    }
  } catch (e) {
    alert("Error saving invoice");
  }
};
