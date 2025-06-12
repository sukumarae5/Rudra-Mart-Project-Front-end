import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import sideImage from "../../src/assets/images/cart.jpg"; // Adjust path if needed

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phonenumber: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({ open: true, message: data.message || "Registered successfully", severity: "success" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setSnackbar({ open: true, message: data.error || "Registration failed", severity: "error" });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setSnackbar({ open: true, message: "Something went wrong", severity: "error" });
    }
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-6 text-center">
          <img
            src={sideImage}
            alt="Register"
            className="img-fluid rounded"
            style={{ maxHeight: "650px" }}
          />
        </div>

        <div className="col-md-6 d-flex justify-content-center">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">Create your account</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-300"
              >
                Register
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <span className="text-green-600 font-medium cursor-pointer" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>

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

export default Register;
