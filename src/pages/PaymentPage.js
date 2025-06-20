import React, { useState, useEffect } from "react";
import {
  Accordion,
  Card,
  Form,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import { FaRegCreditCard } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PaymentPage = () => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "Guest User",
    email: "guest@example.com",
    contact: "0000000000",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

  const totalCost = checkoutData.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

 const placeOrder = async (
  userId,
  addressId,
  token,
  paymentStatus,
  transactionId,
  paymentMethodType
) => {
  try {
    const now = new Date().toISOString();

    console.log("🛒 Placing Order with:", {
      userId,
      addressId,
      token,
      total: totalCost,
      paymentStatus,
      paymentMethodType,
      transactionId,
    });

    if (!userId || !addressId || !token || !paymentStatus || !paymentMethodType || !transactionId) {
      showAlert("❗ Missing required fields. Please login again.", "error");
      setIsLoading(false);
      return;
    }

    const orderResponse = await fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/orders/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          addressId,
          total: totalCost,
          status: paymentStatus, // or use "Pending" explicitly
          deliveryMethod: paymentMethodType,
          orderDate: now,
          createdAt: now,
          updatedAt: now,
          items: checkoutData.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.productPrice,
          })),
        }),
      }
    );

    const orderResult = await orderResponse.json();
    if (!orderResponse.ok) {
      showAlert(orderResult.message || "Order failed", "error");
      return;
    }

    const paymentResponse = await fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/payment/create`,
      {
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
      }
    );

    const paymentResult = await paymentResponse.json();
    if (!paymentResponse.ok) {
      showAlert(paymentResult.message || "Payment failed", "error");
      return;
    }

    showAlert("✅ Order & Payment successful", "success");
    localStorage.removeItem("cart");

    setTimeout(() => {
      navigate("/OrderPlacedSuccessfullyPage");
    }, 1500);
  } catch (error) {
    console.error("❌ Error during order/payment:", error);
    showAlert(error.message || "Something went wrong!", "error");
  } finally {
    setIsLoading(false);
  }
};


  const generateUniqueTransactionId = () => `COD_${Date.now()}`;

  const handleCashOnDelivery = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    const addressId = JSON.parse(localStorage.getItem("addressId"));
    const token = localStorage.getItem("authToken");

    if (!userId || !addressId || !token) {
      showAlert("User info or address missing. Please login again.", "warning");
      setIsLoading(false);
      return;
    }

    await placeOrder(
      userId,
      addressId,
      token,
      "Pending",
      generateUniqueTransactionId(),
      "Cash on Delivery"
    );
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
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    const addressId = JSON.parse(localStorage.getItem("addressId"));

    if (!userId || !addressId || !token) {
      showAlert("User, address, or token missing!", "warning");
      setIsLoading(false);
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      showAlert("Failed to load Razorpay SDK", "error");
      setIsLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_GRRNoJBdPElkDv",
      amount: totalCost * 100,
      currency: "INR",
      name: "Your Store",
      description: "Payment for your order",
      handler: async (response) => {
        await placeOrder(
          userId,
          addressId,
          token,
          "Paid",
          response.razorpay_payment_id,
          "Razorpay"
        );
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact,
      },
      theme: { color: "#3399cc" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="container mt-4">
      <Row>
        <Col>
          <Accordion defaultActiveKey="0">
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
                    <Button
                      onClick={handleCashOnDelivery}
                      disabled={isLoading}
                      variant="success"
                      className="w-100"
                    >
                      {isLoading ? <Spinner animation="border" size="sm" /> : "Place Order (COD)"}
                    </Button>
                  )}

                  {paymentMethod === "razorpay" && (
                    <Button
                      onClick={handleRazorpayPayment}
                      disabled={isLoading}
                      variant="primary"
                      className="w-100"
                    >
                      {isLoading ? <Spinner animation="border" size="sm" /> : "Pay with Razorpay"}
                    </Button>
                  )}
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PaymentPage;