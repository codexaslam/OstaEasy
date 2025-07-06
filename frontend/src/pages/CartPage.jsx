import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page - cart functionality is handled in navbar
    navigate("/");
  }, [navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Redirecting to shopping cart...</h2>
    </div>
  );
};

export default CartPage;
