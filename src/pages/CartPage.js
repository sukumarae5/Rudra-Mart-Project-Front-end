import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems , error, loading } = useSelector((state) => state.cart);
  
  useEffect(() => {
    dispatch(fetchApiCartDataRequest());
  }, [dispatch]);

  console.log("Cart Items from Redux:", cartItems);
  console.log("Cart State from Redux:", useSelector((state) => state.cart));

  return (
    <div>
      <h2>Your Cart</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.product_name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default CartPage;
