import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";
import { fetchApiCartDataRequest, fetcheckeoutpagedata, removeCartItemRequest, updateCartItemQuantityRequest } from "../features/cart/cartActions";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems = [], error } = useSelector((state) => state.cart);
  const { products = [] } = useSelector((state) => state.products || {});
  const navigate = useNavigate();
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
    }
  };

  const totalCost = cartItems.reduce((total, cartItem) => {
    const product = products.find((p) => p.id === cartItem.product_id);
    const price = parseFloat(product?.price || cartItem.price || 0);
    return total + price * cartItem.quantity;
  }, 0);

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

  const handleBuyNow = (cartItem) => {
    const product = products.find((p) => p.id === cartItem.product_id);
    const checkoutData = [
      {
        userId: cartItem.user_id,
        productId: cartItem.product_id,
        productName: product?.name || "Unknown",
        productImage: product?.image_url || "",
        productPrice: parseFloat(product?.price || 0),
        quantity: cartItem.quantity,
        totalPrice: parseFloat(product?.price || 0) * cartItem.quantity,
      },
    ];
    dispatch(fetcheckeoutpagedata(checkoutData));
    navigate("/CheckoutPage");
  };

  const finalCost = (totalCost - discount).toFixed(2);

  return (
    <Container className="mt-4" style={{ padding: "2%", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
      <h1 className="text-center mb-4 text-danger">Shopping Cart</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!cartItems.length ? (
        <h4 className="text-center text-muted">Your cart is empty.</h4>
      ) : (
        <>
          <Table bordered responsive className="mb-4" style={{ backgroundColor: "white", borderRadius: "8px" }}>
            <thead style={{ backgroundColor: "#343a40", color: "white" }}>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
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
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                        />
                        <span className="fw-bold text-dark">{product?.name || cartItem.product_name}</span>
                      </div>
                    </td>
                    <td className="text-primary">₹{price.toFixed(2)}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={cartItem.quantity}
                        onChange={(e) => handleQuantityChange(cartItem.id, e.target.value)}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td className="text-success">₹{(price * cartItem.quantity).toFixed(2)}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleRemoveItem(cartItem.id)}>Remove</Button>
                      <Button 
                        variant="warning" 
                        className="ms-2" 
                        onClick={() => handleBuyNow(cartItem)}
                      >
                        Buy Now
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
                    <Button 
                      variant="danger" 
                      style={{ background: "linear-gradient(45deg,rgb(131, 218, 240), #ff6f61)" }} 
                      onClick={handleApplyCoupon}
                    >
                      Apply Coupon
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col md={6}>
              <div className="p-3 bg-light border rounded">
                <h4 className="text-center text-primary">Cart Total</h4>
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>₹{totalCost.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Discount:</span>
                  <span className="text-danger">₹{discount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span className="text-success">Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-success">₹{finalCost}</strong>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <Button 
                    className="w-100" 
                    style={{ background: "linear-gradient(45deg,rgb(247, 122, 153), #ff6f61)", border: "none", fontWeight: "bold" }} 
                    onClick={() => {
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
                      dispatch(fetcheckeoutpagedata(checkoutData));
                      navigate("/CheckoutPage");
                    }}
                  >
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
