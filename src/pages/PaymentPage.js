import React, { useState, useEffect } from "react";
import { Accordion, Card, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { FaRegCreditCard } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentPage = ({ref}) => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "Guest User",
    email: "guest@example.com",
    contact: "0000000000",
  });

  const navigate = useNavigate();

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

  // Calculate total cost based on checkoutData
  const totalCost = checkoutData.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );
console.log(checkoutData)
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Function to place order and payment record, then navigate on success
  // Function to place order and payment record, then navigate on success
const placeOrder = async (userId, addressId, token, paymentStatus, transactionId, paymentMethodType) => {
  try {
    console.log("Starting order placement...");

    // Step 1: Place Order (including order items)
    const orderResponse = await fetch("http://192.168.1.25:8081/api/orders/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        totalPrice: totalCost,
        status: "Pending", // Adjust this if you have other statuses
        addressId,
        items: checkoutData.map(item => ({
          product_id: item.productId, // Backend format check
          quantity: item.quantity,
          price: item.productPrice,
        })),
      }),
    });

    const orderResult = await orderResponse.json();
    console.log("Order API response:", orderResult);

    if (!orderResponse.ok) {
      alert(orderResult.message || "Failed to place order");
      throw new Error(orderResult.message || "Failed to place order");
    }

    // ✅ Order placed successfully
    alert(orderResult.message);
    
    // Step 2: Create Payment Record
    console.log("Proceeding to create payment record...");
    const paymentResponse = await fetch("http://192.168.1.25:8081/api/payment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        amount: totalCost,
        payment_status: paymentStatus,
        payment_method: paymentMethodType,
        transaction_id: transactionId,
      }),
    });

    const paymentResult = await paymentResponse.json();
    console.log("Payment API response:", paymentResult);

    if (!paymentResponse.ok) {
      alert(paymentResult.message || "Failed to process payment");
      throw new Error(paymentResult.message || "Failed to process payment");
    }
    navigate("/OrderPlacedSuccessfullyPage");

    // ✅ Payment recorded successfully
    alert("Payment processed successfully!");
  
    // Final steps
    localStorage.removeItem("cart");
    alert("Order and payment completed successfully. Redirecting now...");

  } catch (error) {
    console.error("Error during order/payment:", error);
    alert(error.message || "Something went wrong!");
  } finally {
    setIsLoading(false);
  }
};


  const generateUniqueTransactionId = () => {
    return `COD_${Date.now()}`;
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
  
      console.log("Handling Cash on Delivery for userId:", userId);
      await placeOrder(userId, addressId, token, "Pending", generateUniqueTransactionId(), "Cash on Delivery");
  
    } catch (error) {
      console.error("Error placing COD order:", error);
      alert(error.message || "Something went wrong during COD!");
    }
  };
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
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

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) throw new Error("Failed to load Razorpay SDK.");

      const options = {
        key: "rzp_test_GRRNoJBdPElkDv",
        amount: totalCost * 100,
        currency: "INR",
        name: "Your Store",
        description: "Payment for Order",
        handler: async (response) => {
          console.log("Razorpay payment response:", response);
          await placeOrder(userId, addressId, token, "Paid", response.razorpay_payment_id, "Razorpay");
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
        },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className="container mt-4 " >
      <Row style={{width:"103%"}}>
        <Col>
          <Accordion defaultActiveKey="0" >
            <Accordion.Item eventKey="0">
              <Accordion.Header>Payment Method</Accordion.Header>
              <Accordion.Body>
                <Card className="p-4 shadow">
                  <h4>
                    <FaRegCreditCard /> Payment Details
                  </h4>
                  <Form className="mt-3">
                    <Form.Check
                      type="radio"
                      label="Cash on Delivery"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={handlePaymentMethodChange}
                      className="mb-3"
                    />
                    <Form.Check
                      type="radio"
                      label="Razorpay"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={handlePaymentMethodChange}
                      className="mb-4"
                    />
                  </Form>

                  {paymentMethod === "cod" && (
                    <Button onClick={handleCashOnDelivery} disabled={isLoading} variant="success" className="w-100">
                      {isLoading ? <Spinner animation="border" size="sm" /> : "Place Order (COD)"}
                    </Button>
                  )}

                  {paymentMethod === "razorpay" && (
                    <Button onClick={handleRazorpayPayment} disabled={isLoading} variant="primary" className="w-100">
                      {isLoading ? <Spinner animation="border" size="sm" /> : "Pay with Razorpay"}
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
