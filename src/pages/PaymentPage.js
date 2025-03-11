import React, { forwardRef, useState, useEffect } from "react";
import { Accordion, Card, Form, Row, Col, Button } from "react-bootstrap";
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

  const upiUrl =
  totalCost > 0
    ? `upi://pay?pa=test@upi&pn=YourStoreName&am=${totalCost}&cu=INR&tn=Order%20Payment`
    : "";

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true); // Add a state to track loading
      document.body.appendChild(script);
    }, []);
    
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    
    const handleRazorpayPayment = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const addressId = JSON.parse(localStorage.getItem("addressId"));
      const token = localStorage.getItem("authToken");
    
      if (!user || !addressId || !token) {
        alert("User, Address, or Token missing! Please login again.");
        return;
      }    
      const orderData = {
        userId: user.id,
        totalPrice: totalCost,
           addressId: addressId,
      };    
      try {
        const response = await fetch("http://192.168.1.9:8081/api/orders/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });
    
        const result = await response.json();
    
        if (!response.ok) {
          alert(`Failed to create order: ${result.message}`);
          return;
        }
    
        console.log("Order created:", result);
        const orderId = result.orderId; // Assuming your backend returns { orderId: XYZ }
    
        // 📌 Load Razorpay script before opening payment gateway
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          alert("Failed to load Razorpay SDK. Check your internet connection.");
          return;
        }
    
        // 📌 Open Razorpay Payment Gateway
        const options = {
  key: "rzp_test_GRRNoJBdPElkDv", // Use live key in production
  amount: totalCost * 100, // Convert to paise
  currency: "INR",
  name: "Your Store Name",
  description: "Order Payment",
  order_id: `ORD_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${Date.now()}`, // Correct Order ID Format
  handler: function (response) {
    alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
    console.log("Payment Response:", response);  },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone_number,
          },
          theme: { color: "#3399cc" },
        };
    
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Error processing order:", error);
        alert("An error occurred while processing your order.");
      }
    };
    
    // 📌 Function to Load Razorpay Script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
  //   var options = {
      
  //     key: "rzp_test_GRRNoJBdPElkDv",
  //     amount: totalCost * 100, // Convert to paise
  //     currency: "INR",
  //     name: "Your Store Name",
  //     description: "Order Payment",
  //     image: "https://example.com/your_logo",
  //     order_id: "order_IluGWxBm9U8zJ8", // Replace with actual order ID
  //     callback_url: "https://your-callback-url.com/",
  //     prefill: {
  //       name: "Your Name",
  //       email: "your-email@example.com",
  //       contact: "9000090000",
  //     },
  //     theme: {
  //       color: "#3399cc",
  //     },
  //   };
  //   var rzp1 = new window.Razorpay(options);
  //   rzp1.open();
  // };

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
                        <Form.Check
                          type="radio"
                          label="Razorpay"
                          value="razorpay"
                          checked={paymentMethod === "razorpay"}
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

                      {paymentMethod === "razorpay" && (
                        <div className="mt-3 text-center">
                          <Button
                            variant="primary"
                            className="w-100"
                            onClick={handleRazorpayPayment}
                          >
                            Pay with Razorpay
                          </Button>
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
