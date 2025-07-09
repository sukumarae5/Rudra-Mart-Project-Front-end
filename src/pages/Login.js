import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
// import sideImage from "../../src/assets/images/cart.jpg"; // Optional

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const trimmedPhone = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      setSnackbar({
        open: true,
        message: "❌ Please enter a valid Indian phone number.",
        severity: "error",
      });
      return;
    }

    const formattedPhone = `+91${trimmedPhone}`;

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/otp/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formattedPhone }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setSnackbar({
          open: true,
          message: "✅ OTP sent successfully",
          severity: "success",
        });
        setShowOtpModal(true);
      } else if (data.message === "User not found") {
        setSnackbar({
          open: true,
          message: "User not found. Please register.",
          severity: "warning",
        });
        setTimeout(() => {
          navigate("/signup", { state: { phone } });
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Failed to send OTP",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || !phone) {
      setSnackbar({ open: true, message: "OTP and Phone are required", severity: "error" });
      return;
    }

    try {
      const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, phone: `+91${phone.replace(/\D/g, "")}` }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok && data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSnackbar({ open: true, message: "OTP Verified!", severity: "success" });

        setTimeout(() => {
          setShowOtpModal(false);
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Invalid OTP",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setSnackbar({ open: true, message: "Something went wrong", severity: "error" });
    }
  };

  return (
    <div className="vh-100 bg-warning bg-gradient">
      <Container className="h-100 d-flex align-items-center justify-content-center">
        <Row className="w-100">
          {/* Left Section */}
          <Col md={7} className="d-flex flex-column justify-content-center align-items-start p-5">
            <h1 className="fw-bold text-primary display-3">RudraEmart</h1>
            <h3 className="text-dark fs-2">Groceries delivered in 10 minutes</h3>


            <Form onSubmit={handleSendOTP} className="mt-4 w-100">
              <Form.Group controlId="formPhone">
                <Form.Control
                  type="tel"
                  placeholder="+91 Enter Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="rounded-pill px-4 py-3 fs-5 border-0 shadow-sm"
                />
              </Form.Group>

              <Button
                type="submit"
                className={`mt-3 w-100 rounded-pill fw-bold py-3 fs-5 ${isHovered ? "bg-primary" : "bg-primary"
                  }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Continue
              </Button>

              <Button
                variant="outline-primary"
                className="mt-3 w-100 rounded-pill fw-bold"
                onClick={() => navigate("/signup")}
              >
                Create an Account
              </Button>
            </Form>

            <small className="mt-3 text-dark">
              By continuing, you agree to our{" "}
              <span className="text-decoration-underline" role="button">
                Terms of Service
              </span>{" "}
              &{" "}
              <span className="text-decoration-underline" role="button">
                Privacy Policy
              </span>
              .
            </small>
          </Col>

          {/* Right Section */}
      <Col md={5} className="d-flex flex-column justify-content-center align-items-center bg-warning-subtle text-primary p-5 rounded shadow">

            <div className="rounded-circle bg-warning text-primary d-flex justify-content-center align-items-center fs-2 fw-bold mb-3 shadow" style={{ width: "80px", height: "80px" }}>
              R
            </div>

            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              style={{ width: "150px", cursor: "pointer" }}
            />

            <p className="text-center mt-3 fw-bold text-primary">
              Order faster & easier <br /> every time with the RudraEmart App
            </p>
          </Col>
        </Row>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert severity={snackbar.severity} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-warning border-0">
          <Modal.Title className="w-100 text-center fw-bold">🔐 Verify OTP</Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-light border-top border-warning rounded-bottom p-4">
          <Form onSubmit={handleVerifyOTP}>
            <Form.Group>
              <Form.Label className="text-primary fw-semibold">Enter 6-digit OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="rounded px-3 py-2 fs-5 border border-primary shadow-sm"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="mt-4 w-100 text-warning fw-bold rounded-pill py-2 fs-5"
            >
              ✅ Verify OTP
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;
