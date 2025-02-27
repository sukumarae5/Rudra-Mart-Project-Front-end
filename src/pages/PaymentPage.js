import React, { useState } from "react";
import { Accordion, Card, Form, Row, Col, Button, Image } from "react-bootstrap";
import { FaRegCreditCard } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { decreaseQuantity, increaseQuantity, removeProduct } from "../features/cart/cartActions";
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
    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "" }}>
      <div className="container mt-4">
        <Row>
          <Col md={12}>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Order Summary</Accordion.Header>
                <Accordion.Body>
                  <Card className="p-4 shadow-sm border-danger">
                    <h4 className="text-danger">Order Summary</h4>
                    {checkoutData.length > 0 ? (
                      checkoutData.map((item) => (
                        <Row key={item.id} className="mb-3">
                          <Col xs={3}>
                            <Image src={item.productImage} rounded style={{ width: "100px" }} />
                          </Col>
                          <Col>
                            <div>
                              <Button
                                variant="danger"
                                className="p-0"
                                onClick={() => handleRemoveProduct(item.productId)}
                              >
                                <DeleteOutlineOutlinedIcon />
                              </Button>
                              <p><strong>{item.productName}</strong></p>
                              <p>Price: ₹{item.productPrice}</p>
                              <p>Quantity: {item.quantity}</p>
                              <p>Subtotal: ₹{(item.productPrice * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="d-flex">
                              <Button variant="success" className="mr-2" onClick={() => handleIncreaseQuantity(item.productId)}>+</Button>
                              <Button variant="warning" onClick={() => handleDecreaseQuantity(item.productId)}>-</Button>
                            </div>
                          </Col>
                        </Row>
                      ))
                    ) : (
                      <p className="text-muted">No products available in checkout.</p>
                    )}
                    <hr />
                    <h5 className="text-right">Total: ₹{totalCost.toFixed(2)}</h5>
                    <Button variant="primary" className="mt-3 w-100">Place Order</Button>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        <Row>
          <Col style={{ paddingTop: "3%" }}>
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
