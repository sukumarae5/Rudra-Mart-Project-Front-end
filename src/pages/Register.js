import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: data.message || "Registered successfully",
          severity: "success",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Registration failed",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #FFD700, #B8860B)",
        padding: "20px",
      }}
    >
      <Container className="h-100 d-flex align-items-center justify-content-center">
        <Row className="w-100 mx-4">
          {/* Left Column - Form */}
          <Col md={6} className="d-flex flex-column justify-content-center align-items-start px-5">
            <h1 className="fw-bold mb-2 text-primary" style={{ fontSize: "3rem" }}>
              RudraEmart
            </h1>
            <h4 className="mb-4 text-dark" style={{ fontSize: "1.5rem" }}>
              Groceries delivered in 10 minutes
            </h4>

            <Form onSubmit={handleRegister} style={{ width: "100%", maxWidth: "400px" }}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-pill px-4 py-3 fs-5 border border-light shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-pill px-4 py-3 fs-5 border border-light shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="tel"
                  name="phonenumber"
                  placeholder="+91 Enter Phone Number"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  required
                  className="rounded-pill px-4 py-3 fs-5 border border-light shadow-sm"
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100 text-white rounded-pill fw-bold py-3 fs-5"
                style={{ backgroundColor: "#1a73e8", border: "none" }}
              >
                Continue
              </Button>

              <p className="mt-3 text-muted" style={{ fontSize: "0.85rem" }}>
                By continuing, you agree to our{" "}
                <span className="text-dark fw-semibold text-decoration-underline" role="button">
                  Terms of Service
                </span>{" "}
                &{" "}
                <span className="text-dark fw-semibold text-decoration-underline" role="button">
                  Privacy Policy
                </span>
                .
              </p>
            </Form>
          </Col>

          {/* Right Column - Branding */}
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center bg-white rounded shadow"
          >
            <div
              className="text-center d-flex flex-column align-items-center justify-content-center"
              style={{
                width: "100%",
                height: "100%",
                padding: "3rem 2rem",
              }}
            >
              {/* Circle Logo */}
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "#FFD700",
                  color: "blue",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "1.5rem",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                }}
              >
                R
              </div>

              {/* App Store Badge */}
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                style={{ width: "180px", marginBottom: "1.2rem" }}
              />

              {/* App Text */}
              <p className="fw-bold text-primary fs-5">
                Order faster & easier <br />
                every time with the <span style={{ color: "#1a73e8" }}>RudraEmart</span> App
              </p>
            </div>
          </Col>

        </Row>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert severity={snackbar.severity} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Register;
