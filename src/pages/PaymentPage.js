import React, { forwardRef, useState } from "react";
import {Accordion,Card,Form,Row,Col,Button} from "react-bootstrap";
import { FaRegCreditCard } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { QRCodeCanvas } from "qrcode.react";

const PaymentPage = forwardRef((props, ref) => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
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
    <div ref={ref}>
    <PayPalScriptProvider
      options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "" }}
    >
      <div className="container mt-4">

        <Row id="payment-section" className="justify-content-center my-2">
          <Col>
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Payment Method</Accordion.Header>
                <Accordion.Body>
                  <Card
                    className="p-4 mb-4 shadow-lg border-primary"
                    style={{ backgroundColor: "#f0faff" }}
                  >
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
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: "USD",
                                    value: totalCost,
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={handleApprove}
                        />
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div className="mt-3 text-center">
                        <Button
                          variant="success"
                          className="w-100 mb-3"
                          onClick={() => window.location.assign(upiUrl)}
                        >
                          Pay via UPI
                        </Button>
                        <div className="p-3 bg-white shadow rounded">
                          <QRCodeCanvas value={upiUrl} size={200} />
                        </div>
                        <p className="mt-2 text-muted">
                          Scan this QR code to pay via UPI
                        </p>
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
    </div>
  );
});

export default PaymentPage;