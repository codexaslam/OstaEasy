const Dashboard = () => {
  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          color: "#333",
          marginBottom: "1rem",
        }}
      >
        Dashboard Test
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        If you can see this, the route is working!
      </p>
      <p
        style={{
          fontSize: "1rem",
          color: "#888",
          marginTop: "1rem",
        }}
      >
        Dashboard component loaded successfully.
      </p>
    </div>
  );
};

export default Dashboard;
