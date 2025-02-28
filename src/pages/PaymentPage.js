import React, { useState } from "react";
import { Accordion, Card, Form, Row, Col, Button, Image } from "react-bootstrap";
import { FaRegCreditCard } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { decreaseQuantity, increaseQuantity, removeProduct } from "../features/cart/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { QRCodeCanvas } from "qrcode.react";

const PaymentPage = () => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const totalCost = checkoutData.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const upiUrl = `upi://pay?pa=test@upi&pn=YourStoreName&am=${totalCost}&cu=INR&tn=Order%20Payment`;
  const handleUPIPayment = () => {
    window.location.assign(upiUrl);
  };
  
  const handleApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      alert(`Payment successful! Transaction ID: ${details.id}`);
    });
  };

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "" }}>
      <div className="container  mt-4" >
        <Row>
          <Col md={12}>
            <Accordion defaultActiveKey="0" style={{width:"102%"}}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Order Summary</Accordion.Header>
                <Accordion.Body>
                  <Card className="p-4 shadow-sm border-danger" style={{ backgroundColor: "#fffaf0" }}>
                    <h4 className="text-danger">Order Summary</h4>
                    {checkoutData.length > 0 ? (
                      checkoutData.map((item) => (
                        <Row key={item.id} className="mb-3">
                          <Col xs={3}>
                          <a style={{paddingLeft:'30%'}}>

                          <DeleteOutlineOutlinedIcon  onClick={() => dispatch(removeProduct(item.productId))}/>
                          </a>

                            <Image src={item.productImage} rounded style={{ width: "100px" }} />
                            
                              
                          </Col>
                          
                          <Col>
                            <div>
                              
                              <p><strong>{item.productName}</strong></p>
                              <p>Price: <span className="text-success">₹{item.productPrice}</span></p>
                              <p>Quantity: {item.quantity}</p>
                              <p>Subtotal: <span className="text-primary">₹{(item.productPrice * item.quantity).toFixed(2)}</span></p>
                            </div>
                            <div className="d-flex">
                              <Button variant="success" className="me-2" onClick={() => dispatch(increaseQuantity(item.productId))}>+</Button>
                              <Button variant="warning" onClick={() => dispatch(decreaseQuantity(item.productId))}>-</Button>
                             
                            </div>
                          </Col>
                        </Row>
                      ))
                    ) : (
                      <p className="text-muted">No products available in checkout.</p>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded shadow-sm">
  <h5 className="text-danger fw-bold">Total: ₹{totalCost}</h5>
  <Button variant="success" className="px-4 py-2 fw-bold">Confirm Order</Button>
</div>

                    
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        {/* Payment Section */}
        <Row>
          <Col style={{ paddingTop: "3%" }}>
            <Accordion defaultActiveKey="0" style={{width:"102%"}} flush>
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

                    {/* PayPal Button */}
                    {paymentMethod === "paypal" && (
                      <div className="mt-3">
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [{
                                amount: { currency_code: "USD", value: totalCost },
                              }],
                            });
                          }}
                          onApprove={handleApprove}
                        />
                      </div>
                    )}

                    {/* UPI Payment Section */}
                    {paymentMethod === "upi" && (
                      <div className="mt-3 text-center">
                        <Button variant="success" className="w-100 mb-3" onClick={handleUPIPayment}>
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