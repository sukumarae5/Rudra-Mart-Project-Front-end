import React, { useState } from "react";
import {
  Accordion,
  Card,
  Form,
  Row,
  Col,
  Button,
  Image,
} from "react-bootstrap";
import { FaRegCreditCard } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

import {
  decreaseQuantity,
  increaseQuantity,
  removeProduct,
} from "../features/cart/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const fororder = () => {
    if (checkoutData.length === 0) {
      alert(
        "There are no items in your order. Please select an item to proceed."
      );
      return;
    }
    const paymentSection = document.getElementById("payment-section");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCardDetailChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct(productId));
  };

  const totalCost = checkoutData.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  const handleApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      alert(`Payment successful! Transaction ID: ${details.id}`);
    });
  };

  return (
    <PayPalScriptProvider
      options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "" }}
    >
      <div className="container mt-4">
        <Row id="order-section" className="justify-content-center my-2">
          <Col>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <h5 className="mb-0 fw-bold">🛒 Order Summary</h5>
                </Accordion.Header>
                <Accordion.Body>
                  <Card className="p-4 shadow-lg border-0 rounded-4">
                    {checkoutData.length > 0 ? (
                      checkoutData.map((item) => (
                        <Row
                          key={item.id}
                          className="align-items-center p-3 border-bottom"
                        >
                          {/* Product Image */}
                          <Col xs={3} className="text-center">
                            <Image
                              src={item.productImage}
                              rounded
                              fluid
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                              }}
                            />
                          </Col>

                          {/* Product Details */}
                          <Col xs={6}>
                            <h1 className="fw-bold">{item.productName}</h1>
                            <p className="text-muted m-0">
                              Price: ₹{item.productPrice}
                            </p>
                            <p className="fw-bold">
                              Subtotal: ₹
                              {(item.productPrice * item.quantity).toFixed(2)}
                            </p>
                          </Col>

                          {/* Action Buttons (Aligned to Right) */}
                          <Col xs={2} className="text-end">
                            <div className="d-flex justify-content-end align-items-center gap-2">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  handleDecreaseQuantity(item.productId)
                                }
                              >
                                <FaMinus />
                              </Button>
                              <span className="fw-bold">{item.quantity}</span>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() =>
                                  handleIncreaseQuantity(item.productId)
                                }
                              >
                                <FaPlus />
                              </Button>
                            </div>
                            <br></br>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleRemoveProduct(item.productId)
                              }
                            >
                              <FaTrash />
                            </Button>
                          </Col>
                        </Row>
                      ))
                    ) : (
                      <p className="text-muted text-center">
                        No products available in checkout.
                      </p>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded shadow-sm">
                      <h5 className="text-danger fw-bold">
                        Total: ₹{totalCost}
                      </h5>
                      <Button variant="success" onClick={fororder} className="px-4 py-2 fw-bold">
                        Confirm Order
                      </Button>
                    </div>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        <Row id="payment-section" className="justify-content-center my-2">
          <Col>
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Payment Method</Accordion.Header>
                <Accordion.Body>
                  <Card className="p-4 mb-4 shadow-sm border-primary">
                    <h4 className="text-primary d-flex align-items-center">
                      <FaRegCreditCard className="me-2" /> Payment Details
                    </h4>
                    <Form>
                      <Form.Check
                        type="radio"
                        label="Cash on Delivery"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={handlePaymentMethodChange}
                      />
                      <Form.Check
                        type="radio"
                        label="PayPal"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={handlePaymentMethodChange}
                      />
                    </Form>
                    {paymentMethod === "paypal" && (
                      <div className="mt-3">
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: "USD",
                                    value: totalCost.toFixed(2),
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={handleApprove}
                        />
                      </div>
                    )}
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentPage;
