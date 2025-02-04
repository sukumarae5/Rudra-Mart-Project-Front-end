import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";
import { updateCartProductQuantity } from "../features/cart/cartActions";

const CartPage = () => {
  const { cartProducts } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) {
      alert("Quantity cannot be less than 1");
      return;
    }
    dispatch(updateCartProductQuantity(productId, parseInt(quantity, 10)));
  };

  const totalCost = cartProducts.reduce(
    (total, product) => total + parseFloat(product.price) * product.quantity,
    0
  );

  const handleApplyCoupon = () => {
    if (couponCode === "DISCOUNT10") {
      setDiscount(0.10 * totalCost);
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
    <Container className="mt-4" style={{padding:"1%"}}>
      <h1 className="text-center mb-4">Shopping Cart</h1>
      {!cartProducts.length ? (
        <h4 className="text-center text-muted">Your cart is empty.</h4>
      ) : (
        <>
          {/* Product Table */}
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="me-2"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>₹{parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={product.quantity}
                      className="w-20"
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    />
                  </td>
                  <td>₹{(parseFloat(product.price) * product.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Coupon and Cart Summary Section */}
          <Row className="mt-4">
          <Col md={6}>
  <Form>
    <Row className="align-items-center">
      <Col xs={8}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col xs={4} >
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
      <hr />
      <div className="d-flex justify-content-between">
        <strong>Total:</strong>
        <strong>₹{finalCost}</strong>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <Button variant="danger" className="w-50">
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
