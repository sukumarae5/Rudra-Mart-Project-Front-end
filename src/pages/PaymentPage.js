import React, { useState, useEffect } from "react";
import { Accordion, Card, Form, Row, Col, Button } from "react-bootstrap";
import { FaRegCreditCard } from "react-icons/fa";
import { useSelector } from "react-redux";

const PaymentPage = () => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "Guest User",
    email: "guest@example.com",
    contact: "0000000000",
  });
console.log(checkoutData)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserDetails({
        name: storedUser.name || "Guest User",
        email: storedUser.email || "guest@example.com",
        contact: storedUser.phone_number || "0000000000",
      });
    }
  }, []);

  // Calculate total cost
  const totalCost = checkoutData.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );
console.log(checkoutData)
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const placeOrder = async (userId, addressId, token, paymentStatus, transactionId, paymentMethod) => {
    try {
      const orderResponse = await fetch("http://192.168.1.15:8081/api/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          userId: userId,
          totalPrice: totalCost,
          status: "Pending",
          addressId: addressId,
          items: checkoutData.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.productPrice,
          })),
        }),
      });
  
      const orderResult = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(orderResult.message || "Failed to place order");
      }
  
      alert("✅ Order placed successfully!");

  
      // Step 2: Create Payment Record
      const paymentResponse = await fetch("http://192.168.1.15:8081/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          user_id: userId,
          amount: totalCost,
          payment_status: paymentStatus,
          payment_method: paymentMethod,
          transaction_id: transactionId,
        }),
      });
  
      const paymentResult = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(paymentResult.message || "Failed to process payment");
      }
  
      alert("✅ Payment recorded successfully!");
      localStorage.removeItem("cart");
  
    } catch (error) {
      console.error("Error processing order/payment:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCashOnDelivery = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id; 
      const addressId = JSON.parse(localStorage.getItem("addressId"));
      const token = localStorage.getItem("authToken");

      if (!user || !addressId || !token) {
        alert("User, Address, or Token missing! Please login again.");
        setIsLoading(false);
        return;
      }

      await placeOrder(userId, addressId, token, "Pending", "COD_NO_TXN", "Cash on Delivery");

    } catch (error) {
      console.error("Error placing COD order:", error);
      alert(error.message);
    }
  };

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id; 
      const addressId = JSON.parse(localStorage.getItem("addressId"));

      if (!user || !addressId || !token) {
        alert("User, Address, or Token missing! Please login again.");
        setIsLoading(false);
        return;
      }

      // Load Razorpay SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load.");
      }

      // Initialize Razorpay Payment
      const options = {
        key: "rzp_test_GRRNoJBdPElkDv",
        amount: totalCost * 100,
        currency: "INR",
        name: "Your Store Name",
        description: "Order Payment",
        handler: async function (response) {
          alert("✅ Payment Successful!");

          await placeOrder(userId, addressId, token, "Paid", response.razorpay_payment_id, "Razorpay");
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone_number,
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error processing Razorpay order:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4 " >
      <Row style={{width:"103%"}}>
        <Col>
          <Accordion >
            <Accordion.Item eventKey="0">
              <Accordion.Header>Payment Method</Accordion.Header>
              <Accordion.Body>
                <Card className="p-3">
                  <h4>
                    <FaRegCreditCard /> Payment Details
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
                      label="Razorpay"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={handlePaymentMethodChange}
                    />
                  </Form>

                  {paymentMethod === "cod" && (
                    <Button onClick={handleCashOnDelivery} disabled={isLoading}>
                      {isLoading ? "Processing..." : "Place Order (COD)"}
                    </Button>
                  )}

                  {paymentMethod === "razorpay" && (
                    <Button onClick={handleRazorpayPayment} disabled={isLoading}>
                      {isLoading ? "Processing..." : "Pay with Razorpay"}
                    </Button>
                  )}
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentPage;