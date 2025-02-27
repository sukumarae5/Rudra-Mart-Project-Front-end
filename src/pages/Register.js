import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sideImage from "../../src/assets/images/cart.jpg";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode"; // ✅ Correct for jwt-decode@3.x.x

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState(null); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!/[A-Z]/.test(formData.password)) {
      setLoading(false);
      setError("Password must contain at least one uppercase letter");
      return;
    }
    // Role validation
    if (formData.role !== "customer" && formData.role !== "admin") {
      setLoading(false);
      setError("Role must be either 'customer' or 'admin'");
      return;
    }
    try {
      const newUser = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
      };

      const response = await fetch(
        "http://192.168.1.12:3000/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.message || "Failed to create account");
        return;
      }

      setMessage("User registered successfully! Check your email.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setLoading(false);
      setError(error.message || "Registration failed, please try again later");
    }
  };


  const handleGoogleSuccess = async (response) => {    
      const { credential } = response;  
      if (!credential) {
        console.error("Google login failed: No credential received");
        return;
      }
      const decodedToken = jwt_decode(credential);
      console.log("Decoded Token:", decodedToken);  
    }   
  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
  };
    return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-6 text-center">
          <img
            src={sideImage}
            alt="Sign Up"
            className="img-fluid rounded"
            style={{ maxHeight: "650px" }}
          />
        </div>
        <div className="col-md-6 d-flex justify-content-center">
          <div style={{ maxWidth: "400px" }}>
            <h2 className="fw-bold mb-4">Create an Account</h2>
            <p className="text-muted mb-4">Enter your details below</p>

            {error && <p className="text-danger">{error}</p>} {/* Show error */}
            {message && <p className="text-success">{message}</p>} {/* Show success */}

            <form onSubmit={handleSubmit}>
              {[
                { type: "text", name: "name", placeholder: "Name" },
                { type: "email", name: "email", placeholder: "Email" },
                { type: "text", name: "phoneNumber", placeholder: "Phone Number" },
                { type: "password", name: "password", placeholder: "Password" },
                { type: "text", name: "role", placeholder: "Role (customer/admin)" },
              ].map((input, index) => (
                <input
                  key={index}
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
                  onChange={handleChange}
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  required
                />
              ))}

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-violet-600 focus:outline-none"
                disabled={loading}
              >
                {loading ? <span className="spinner-border spinner-border-sm"></span> : "Create Account"}
              </button>
            </form>

            {/* <button
              onClick={handleGoogleSignUp}
              className="w-full d-flex align-items-center justify-content-center mt-3 py-2 px-4 border border-gray-300 rounded-lg"
            >
              <FcGoogle className="me-2" size={20}
               />
              Sign Up with Google
            </button> */}
            <div className="text-center mt-3">

<GoogleLogin className="me-2" 
onSuccess={handleGoogleSuccess}
onError={handleGoogleFailure}
/>
            </div>
            <p className="text-muted mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-black">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
