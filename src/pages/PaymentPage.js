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
import { QRCodeCanvas } from "qrcode.react";

const PaymentPage = () => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const fororder = () => {
    if (checkoutData.length === 0) {
      alert("There are no items in your order. Please select an item to proceed.");
      return;
    }
    const paymentSection = document.getElementById("payment-section");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
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

  const upiUrl = `upi://pay?pa=test@upi&pn=YourStoreName&am=${totalCost}&cu=INR&tn=Order%20Payment`;

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "" }}>
      <div className="container mt-4">
        <Row>
          <Col md={12}>
            <Accordion defaultActiveKey="0" style={{ width: "102%" }}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <h5 className="mb-0 fw-bold">🛒 Order Summary</h5>
                </Accordion.Header>
                <Accordion.Body>
                  <Card className="p-4 shadow-lg border-0 rounded-4">
                    {checkoutData.length > 0 ? (
                      checkoutData.map((item) => (
                        <Row key={item.id} className="align-items-center p-3 border-bottom">
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
                          <Col xs={6}>
                            <h1 className="fw-bold">{item.productName}</h1>
                            <p className="text-muted m-0">Price: ₹{item.productPrice}</p>
                            <p className="fw-bold">
                              Subtotal: ₹{(item.productPrice * item.quantity).toFixed(2)}
                            </p>
                          </Col>
                          <Col xs={2} className="text-end">
                            <div className="d-flex justify-content-end align-items-center gap-2">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDecreaseQuantity(item.productId)}
                              >
                                <FaMinus />
                              </Button>
                              <span className="fw-bold">{item.quantity}</span>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleIncreaseQuantity(item.productId)}
                              >
                                <FaPlus />
                              </Button>
                            </div>
                            <br />
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRemoveProduct(item.productId)}
                            >
                              <FaTrash />
                            </Button>
                          </Col>
                        </Row>
                      ))
                    ) : (
                      <p className="text-muted text-center">No products available in checkout.</p>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded shadow-sm">
                      <h5 className="text-danger fw-bold">Total: ₹{totalCost}</h5>
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
                  <Card className="p-4 mb-4 shadow-lg border-primary" style={{ backgroundColor: "#f0faff" }}>
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
                      <Form.Check
                        type="radio"
                        label="UPI (Google Pay, PhonePe, Paytm)"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={handlePaymentMethodChange}
                      />
                    </Form>

                    {paymentMethod === "paypal" && (
                      <div className="mt-3">
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [{ amount: { currency_code: "USD", value: totalCost } }],
                            });
                          }}
                          onApprove={handleApprove}
                        />
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div className="mt-3 text-center">
                        <Button variant="success" className="w-100 mb-3" onClick={() => window.location.assign(upiUrl)}>
                          Pay via UPI
                        </Button>
                        <div className="p-3 bg-white shadow rounded">
                          <QRCodeCanvas value={upiUrl} size={200} />
                        </div>
                        <p className="mt-2 text-muted">Scan this QR code to pay via UPI</p>
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
