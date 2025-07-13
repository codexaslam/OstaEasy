import { BarChart3 } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [test] = useState("Dashboard loaded successfully");

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            fontSize: "2rem",
            color: "#333",
          }}
        >
          <BarChart3 size={32} />
          ostaeasy Analytics Dashboard
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>{test}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #000",
          }}
        >
          <h3>Test Card 1</h3>
          <p>This is a test card</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #10b981",
          }}
        >
          <h3>Test Card 2</h3>
          <p>This is another test card</p>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p>If you can see this, the basic dashboard structure is working!</p>
      </div>
    </div>
  );
};

export default Dashboard;
