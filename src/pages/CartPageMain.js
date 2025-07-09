import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApiCartDataRequest,
  fetcheckeoutpagedata,
  removeCartItemRequest,
  updateCartItemQuantityRequest,
} from "../features/cart/cartActions";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  ProgressBar,
  Alert,
} from "react-bootstrap";

const CartPageMain = () => {
  const dispatch = useDispatch();
  const { cartItems = [], error } = useSelector((state) => state.cart);
  const { products = [] } = useSelector((state) => state.products || {});
  const navigate = useNavigate();

  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    dispatch(fetchApiCartDataRequest());
  }, [dispatch]);

  const handleRemoveItem = (id) => dispatch(removeCartItemRequest(id));

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItemQuantityRequest(id, quantity));
    }
  };

  const totalMRP = cartItems.reduce((total, item) => {
    const product = products.find((p) => p.id === item.product_id);
    return total + (parseFloat(product?.mrp || 0) * item.quantity);
  }, 0);

  const totalSelling = cartItems.reduce((total, item) => {
    const product = products.find((p) => p.id === item.product_id);
    return total + (parseFloat(product?.selling_price || 0) * item.quantity);
  }, 0);

  const totalSavings = totalMRP - totalSelling;
  const finalCost = (totalSelling - discount).toFixed(2);
  const amountLeftForFreeDelivery = 499 - finalCost;

  const handleBuyNow = () => {
    const checkoutData = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        userId: item.user_id,
        productId: item.product_id,
        productName: product?.name,
        productImage: product?.image_url,
        productPrice: parseFloat(product?.selling_price || 0),
        quantity: item.quantity,
        totalPrice: parseFloat(product?.selling_price || 0) * item.quantity,
      };
    });
    dispatch(fetcheckeoutpagedata(checkoutData));
    navigate("/CheckoutPage");
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 fw-bold text-primary">🛒 Delivery from Rudra-Mart Shopping</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-muted">Your cart is empty.</div>
      ) : (
        <Row>
          <Col lg={8}>
            <Card className="p-3 shadow-sm">
              {cartItems.map((item) => {
                const product = products.find((p) => p.id === item.product_id);
                const sellingPrice = parseFloat(product?.selling_price || 0);
                const mrp = parseFloat(product?.mrp || 0);
                const quantity = item.quantity;
                const discountPerItem = mrp - sellingPrice;

                return (
                  <div
                    key={item.id}
                    className="d-flex align-items-start border-bottom py-3"
                  >
                    <img
                      src={product?.image_url}
                      alt={product?.name}
                      className="rounded"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        marginRight: "16px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{product?.name} || {product?.stock} || {product?.unit}</h6>
                      <p className="text-muted small mb-2">
                        by {product?.description || "Brand"}
                      </p>

                      <div className="mb-2">
                        <div className="d-flex align-items-center mb-1">
                          <strong className="text-primary me-2">Selling Price:</strong>
                          <span className="fw-semibold text-dark">₹{sellingPrice}</span>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <strong className="text-secondary me-2">MRP:</strong>
                          <span className="text-muted text-decoration-line-through">
                            ₹{mrp}
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <strong className="text-success me-2">You Save:</strong>
                          <span>₹{(discountPerItem * quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <Form.Select
                          value={quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value))
                          }
                          style={{ width: "80px", marginRight: "10px" }}
                          className="shadow-sm"
                        >
                          {[1, 2, 3, 4, 5].map((qty) => (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          ))}
                        </Form.Select>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                         Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="p-4 shadow-sm mt-4 mt-lg-0">
              <h5 className="mb-3 text-warning fw-bold">
                Rudra-Mart Subtotal ({cartItems.length} item
                {cartItems.length > 1 ? "s" : ""})
              </h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Total:</span>
                <strong className="text-primary">₹{finalCost}</strong>
              </div>

              <div className="d-flex justify-content-between text-success mb-2">
                <span>Total Savings:</span>
                <span>₹{totalSavings.toFixed(2)}</span>
              </div>

              <ProgressBar
                now={(finalCost / 499) * 100}
                variant="success"
                className="mb-2"
              />

              {finalCost < 499 ? (
                <div className="text-muted small mb-3">
                  Add items worth ₹{amountLeftForFreeDelivery.toFixed(2)} to get
                  FREE delivery!
                </div>
              ) : (
                <div className="text-success small mb-3">
                  You're eligible for free delivery 🎉
                </div>
              )}

              <Button
                variant="warning"
                className="w-100 fw-bold text-dark mb-2"
                onClick={handleBuyNow}
              >
              Proceed to Buy quality & Fresh Items
              </Button>

              <div className="text-center">
                <a as={Link} to="/" className="text-decoration-none text-primary small">
                  Continue shopping on Rudra-mart
                </a>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartPageMain;
