import { useState } from "react";
import Invoice from "./pages/Invoice";
import Ledger from "./pages/Ledger";

function App() {
  const [activeTab, setActiveTab] = useState("invoice");

  return (
    <div className="app-shell">
      <div className="nav-bar">
        <button className={`nav-button ${activeTab === "invoice" ? "active" : ""}`} onClick={() => setActiveTab("invoice")}>New Invoice</button>
        <button className={`nav-button ${activeTab === "ledger" ? "active" : ""}`} onClick={() => setActiveTab("ledger")}>Ledger</button>
      </div>

      <div className="page-area">
        {activeTab === "invoice" && <Invoice />}
        {activeTab === "ledger" && <Ledger />}
      </div>
    </div>
  );
}

const tabStyle = (active) => ({
  background: active ? "#555" : "transparent",
  color: "white",
  border: "none",
  padding: "10px 15px",
  cursor: "pointer",
  fontSize: "16px",
  borderRadius: "5px"
});

export default App;