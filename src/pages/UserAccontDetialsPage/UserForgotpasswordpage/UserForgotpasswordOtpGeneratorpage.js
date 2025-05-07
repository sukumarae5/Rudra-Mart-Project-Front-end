import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const UserForgotpasswordOtpGeneratorpage = () => {
  const [selectedOption, setSelectedOption] = useState("email");
  const [userData, setUserData] = useState({ email: "", phone_number: "" });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const userforgotdata = JSON.parse(localStorage.getItem("forgetuser"));
    if (userforgotdata) {
      setUserData(userforgotdata);
    }
  }, []);

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      email: selectedOption === "email" ? prev.email : prev.email,
      phone_number: selectedOption === "phone" ? prev.phone_number : prev.phone_number,
    }));
  }, [selectedOption]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name === "phone" ? "phone_number" : name]: value,
    });
  };

  const handleGenerateOtp = async (e) => {
    e.preventDefault();

    const contactValue = selectedOption === "email"
      ? userData.email.trim()
      : userData.phone_number.trim();

    if (!contactValue) {
      showSnackbar(`Please enter a valid ${selectedOption}`, "warning");
      return;
    }

    const otpRequestData = { method: selectedOption, value: contactValue };

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/otp/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(otpRequestData),
        }
      );
      const result = await response.json();

      if (response.ok) {
        showSnackbar(`OTP sent via ${selectedOption}`, "success");
        localStorage.setItem("otpRequestData", JSON.stringify(otpRequestData));
        setShowOtpModal(true);
      } else {
        showSnackbar(`Failed: ${result.message || "Unknown error"}`, "error");
      }
    } catch (error) {
      showSnackbar(`Error: ${error.message}`, "error");
    }
  };

  const handleVerifyOtp = async () => {
    const { method, value } = JSON.parse(localStorage.getItem("otpRequestData"));

    const payload = {
      otp,
      value,
    };

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/otp/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (response.ok) {
        showSnackbar("OTP verified successfully!", "success");
        setShowOtpModal(false);
        navigate("/UserSetNewpasswordpage");
      } else {
        showSnackbar(result.message || "OTP verification failed", "error");
      }
    } catch (error) {
      showSnackbar(`Error verifying OTP: ${error.message}`, "error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow w-100" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h4 className="text-center mb-4">OTP Generator</h4>
          <form onSubmit={handleGenerateOtp}>
            <div className="mb-3">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contactOption"
                  checked={selectedOption === "email"}
                  onChange={() => setSelectedOption("email")}
                />
                <label className="form-check-label">Email</label>
              </div>
              <input
                type="email"
                className="form-control mt-2"
                placeholder="Enter your email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={selectedOption !== "email"}
                required={selectedOption === "email"}
              />
            </div>

            <div className="mb-4">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="contactOption"
                  checked={selectedOption === "phone"}
                  onChange={() => setSelectedOption("phone")}
                />
                <label className="form-check-label">Phone</label>
              </div>
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Enter your phone number"
                name="phone"
                value={userData.phone_number}
                onChange={handleInputChange}
                disabled={selectedOption !== "phone"}
                required={selectedOption === "phone"}
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-danger px-4">
                Send OTP
              </button>
            </div>
          </form>
        </div>
      </div>

      {showOtpModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter OTP</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowOtpModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label">OTP</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowOtpModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default UserForgotpasswordOtpGeneratorpage;
