import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";
import {
  fetchApiCartDataRequest,
  fetcheckeoutpagedata,
  removeCartItemRequest,
  updateCartItemQuantityRequest,
} from "../features/cart/cartActions";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems = [], error } = useSelector((state) => state.cart);
  const { products = [] } = useSelector((state) => state.products || {});
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

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

  // Calculate MRP total and Selling Price total
  const { totalSellingPrice, totalMrp } = cartItems.reduce(
    (acc, cartItem) => {
      const product = products.find((p) => p.id === cartItem.product_id);
      const mrp = parseFloat(product?.mrp || 0);
      const selling = parseFloat(product?.selling_price || cartItem.price || 0);
      const quantity = cartItem.quantity;

      acc.totalMrp += mrp * quantity;
      acc.totalSellingPrice += selling * quantity;
      return acc;
    },
    { totalMrp: 0, totalSellingPrice: 0 }
  );

  const productDiscount = totalMrp - totalSellingPrice;
  const finalCost = (totalSellingPrice - couponDiscount).toFixed(2);

  const handleApplyCoupon = () => {
    if (couponCode === "DISCOUNT10") {
      setCouponDiscount(0.1 * totalSellingPrice);
      alert("Coupon applied successfully! 10% discount applied.");
    } else if (couponCode === "FLAT50") {
      setCouponDiscount(50);
      alert("Coupon applied successfully! ₹50 discount applied.");
    } else {
      alert("Invalid coupon code!");
      setCouponDiscount(0);
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
        productPrice: parseFloat(product?.selling_price || 0),
        quantity: cartItem.quantity,
        totalPrice: parseFloat(product?.selling_price || 0) * cartItem.quantity,
      },
    ];
    dispatch(fetcheckeoutpagedata(checkoutData));
    navigate("/CheckoutPage");
  };

  const handleProceedToCheckout = () => {
    const checkoutData = cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.product_id);
      return {
        userId: cartItem.user_id,
        productId: cartItem.product_id,
        productName: product?.name || "Unknown",
        productImage: product?.image_url || "",
        productPrice: parseFloat(product?.selling_price || product?.price || 0),
        quantity: cartItem.quantity,
        totalPrice:
          parseFloat(product?.selling_price || product?.price || 0) * cartItem.quantity,
      };
    });
    dispatch(fetcheckeoutpagedata(checkoutData));
    navigate("/CheckoutPage");
  };

  return (
    <Container className="mt-4" style={{ padding: "2%", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
      <h1 className="text-center mb-4 text-danger">Shopping Cart</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!cartItems.length ? (
        <h4 className="text-center text-muted">
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
          Your cart is empty.
        </h4>
      ) : (
        <>
          <Table bordered responsive className="mb-4" style={{ backgroundColor: "white", borderRadius: "8px" }}>
            <thead style={{ backgroundColor: "#343a40", color: "white" }}>
              <tr>
                <th>Product</th>
                <th>Price Details</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cartItem) => {
                const product = products.find((p) => p.id === cartItem.product_id);
                const mrp = parseFloat(product?.mrp || 0);
                const selling = parseFloat(product?.selling_price || cartItem.price || 0);
                const subtotal = selling * cartItem.quantity;

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
                    <td>
                      <div>
                        <span className="text-danger fw-bold">₹{selling.toFixed(2)}</span>
                        <br />
                        <small className="text-muted text-decoration-line-through">₹{mrp.toFixed(2)}</small>
                        <br />
                        {mrp > selling && (
                          <small className="text-success fw-bold">
                            {Math.round(((mrp - selling) / mrp) * 100)}% OFF
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={cartItem.quantity}
                        onChange={(e) => handleQuantityChange(cartItem.id, e.target.value)}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td className="text-success">₹{subtotal.toFixed(2)}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleRemoveItem(cartItem.id)}>Remove</Button>
                      <Button variant="warning" className="ms-2" onClick={() => handleBuyNow(cartItem)}>Buy Now</Button>
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
                <h4 className="text-center text-primary">Cart Summary</h4>
                <div className="d-flex justify-content-between">
                  <span>Total MRP:</span>
                  <span>₹{totalMrp.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total Selling Price:</span>
                  <span>₹{totalSellingPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Product Discount:</span>
                  <span className="text-success">-₹{productDiscount.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="d-flex justify-content-between">
                    <span>Coupon Discount:</span>
                    <span className="text-success">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span className="text-success">Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Grand Total:</strong>
                  <strong className="text-success">₹{finalCost}</strong>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <Button
                    className="w-100"
                    style={{
                      background: "linear-gradient(45deg, rgb(247, 122, 153), #ff6f61)",
                      border: "none",
                      fontWeight: "bold",
                    }}
                    onClick={handleProceedToCheckout}
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