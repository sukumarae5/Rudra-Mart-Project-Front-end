import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone;

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
        body: JSON.stringify({ otp, phone }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSnackbar({ open: true, message: "OTP Verified!", severity: "success" });

        setTimeout(() => {
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
    <div className="container py-5 text-center">
      <h2>Enter OTP</h2>
      <form onSubmit={handleVerifyOTP}>
        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mt-3 p-3 w-50 border border-gray-400 rounded"
          required
        />
        <br />
        <button className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg" type="submit">
          Verify OTP
        </button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert severity={snackbar.severity} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default VerifyOTP;