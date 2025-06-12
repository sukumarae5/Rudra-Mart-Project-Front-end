import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Container, Row, Col, Button } from "react-bootstrap";
import sideImage from "../../src/assets/images/cart.jpg";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      setSnackbar({ open: true, message: "Valid phone number required", severity: "error" });
      return;
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    try {
      const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await response.json();

      if (data.success) {
        setSnackbar({ open: true, message: "OTP sent successfully", severity: "success" });
        setTimeout(() => {
          navigate("/verify-otp", { state: { phone: formattedPhone } });
        }, 1000);
      } else if (data.message === "User not found") {
        setSnackbar({ open: true, message: "User not found. Please register.", severity: "warning" });
        setTimeout(() => {
          navigate("/register", { state: { phone } }); // Optional: pass phone number
        }, 1500);
      } else {
        setSnackbar({ open: true, message: data.message || "Failed to send OTP", severity: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({ open: true, message: "Something went wrong", severity: "error" });
    }
  };

  return (
    <Container fluid className="py-5">
      <Row className="align-items-center">
        <Col md={6} className="text-center">
          <img src={sideImage} alt="Login" className="img-fluid rounded" style={{ maxHeight: "650px" }} />
        </Col>
        <Col md={6} className="d-flex justify-content-center">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <h1 className="fw-bold mb-4 text-success">Login with OTP</h1>
            <form onSubmit={handleSendOTP}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number (e.g. 9876543210)"
                className="form-control p-3 mb-3 border rounded"
                required
              />
              <button
                type="submit"
                className="w-100 mb-2 py-2 px-4 bg-success text-white fw-semibold rounded border-0"
              >
                Send OTP
              </button>
              <Button
                variant="outline-success"
                className="w-100"
                onClick={() => navigate("/signup")}
              >
                Create an Account
              </Button>
            </form>
          </div>
        </Col>
      </Row>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert severity={snackbar.severity} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Login;