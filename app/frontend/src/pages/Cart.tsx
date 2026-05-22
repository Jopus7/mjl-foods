import React from "react";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  // Tutaj pobierzesz dane z localStorage lub Context API
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = cartItems.reduce(
    (acc: number, item: any) => acc + item.price,
    0
  );

  return (
    <div className="cart-container">
      <h1>Twój koszyk</h1>
      <div className="cart-list">
        {cartItems.map((item: any, index: number) => (
          <div key={index} className="cart-row">
            <span>{item.name}</span>
            <span>{item.price} PLN</span>
          </div>
        ))}
      </div>
      <div className="summary">
        <h3>Suma: {total} PLN</h3>
        <button onClick={() => navigate("/checkout")}>Przejdź dalej</button>
      </div>
    </div>
  );
};

export default Cart;
