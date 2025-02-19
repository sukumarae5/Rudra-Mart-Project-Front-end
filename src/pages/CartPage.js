import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";
import { fetchApiCartDataRequest, fetcheckeoutpagedata, removeCartItemRequest, updateCartItemQuantityRequest } from "../features/cart/cartActions";
import { useNavigate } from "react-router-dom";
// import CheckoutPage from "./CheckoutPage";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems = [], error } = useSelector((state) => state.cart);
  const { products = [] } = useSelector((state) => state.products || {});
const navigate=useNavigate()
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    dispatch(fetchApiCartDataRequest());
  }, [dispatch]);

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeCartItemRequest(cartItemId));
  };

  const handleQuantityChange = (cartItemId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItemQuantityRequest(cartItemId, quantity));
      console.log(cartItemId)
      
    }
  };

  const totalCost = cartItems.reduce((total, cartItem) => {
    const product = products.find((p) => p.id === cartItem.product_id);
    const price = parseFloat(product?.price || cartItem.price || 0);
    return total + price * cartItem.quantity;
  }, 0);
// const CheckoutPagedata=()=>{
//   dispatch(fetcheckeoutpagedata())

//   navigate("/CheckoutPage")
// }
  const handleApplyCoupon = () => {
    if (couponCode === "DISCOUNT10") {
      setDiscount(0.1 * totalCost);
      alert("Coupon applied successfully! 10% discount applied.");
    } else if (couponCode === "FLAT50") {
      setDiscount(50);
      alert("Coupon applied successfully! ₹50 discount applied.");
    } else {
      alert("Invalid coupon code!");
      setDiscount(0);
    }
  };

  const finalCost = (totalCost - discount).toFixed(2);

  return (
    <Container className="mt-4" style={{ padding: "2%" }}>
      <h1 className="text-center mb-4">Shopping Cart</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!cartItems.length ? (
        <h4 className="text-center text-muted">Your cart is empty.</h4>
      ) : (
        <>
          <Table bordered responsive className="mb-4">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cartItem) => {
                const product = products.find((p) => p.id === cartItem.product_id);
                const price = parseFloat(product?.price || cartItem.price || 0);
                return (
                  <tr key={cartItem.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={product?.image_url}
                          alt={product?.name || cartItem.product_name}
                          className="me-2"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                        <span>{product?.name || cartItem.product_name}</span>
                      </div>
                    </td>
                    <td>₹{price.toFixed(2)}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={cartItem.quantity}
                        onChange={(e) => handleQuantityChange(cartItem.id, (e.target.value))}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>₹{(price * cartItem.quantity).toFixed(2)}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleRemoveItem(cartItem.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Row className="mb-4">
            <Col md={6} className="d-flex align-items-center">
              <Form className="w-100">
                <Row className="align-items-center">
                  <Col xs={8}>
                    <Form.Group className="mb-0">
                      <Form.Control
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={4}>
                    <Button variant="danger" onClick={handleApplyCoupon}>
                      Apply Coupon
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col md={6}>
              <div className="p-3 bg-light border rounded">
                <h4 className="text-center">Cart Total</h4>
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>₹{totalCost.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Discount:</span>
                  <span>₹{discount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong>₹{finalCost}</strong>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="danger" className="w-100" onClick={()=>{
                       const checkoutData = cartItems.map((cartItem) => {
                        const product = products.find((p) => p.id === cartItem.product_id);
                        return {
                          userId: cartItem.user_id,
                          productId: cartItem.product_id,
                          productName: product?.name || "Unknown",
                          productImage: product?.image_url || "",
                          productPrice: parseFloat(product?.price || 0),
                          quantity: cartItem.quantity,
                          totalPrice: parseFloat(product?.price || 0) * cartItem.quantity,
                        };
                      });
                  
  dispatch(fetcheckeoutpagedata(checkoutData))

  navigate("/CheckoutPage")
}}>
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default CartPage;
