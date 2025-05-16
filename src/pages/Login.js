import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchusersrequest } from "../features/user/userActions";
import sideImage from "../../src/assets/images/cart.jpg";

// Material UI
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Login = () => {
  const dispatch = useDispatch();
  const { users = [] } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const { email, password } = login;

  const changefun = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(fetchusersrequest());
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setSnackbar({
        open: true,
        message: "Both fields are required",
        severity: "error",
      });
      return;
    }
const matchtheadmindata=(users.find((user)=>user.email===email && user.password===password && user.role==="admin"))
if (matchtheadmindata){
      setSnackbar({
        open: true,
        message: "Admin Login Successful!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/admin/admindashboard");
      }, 1000);
      return;
    }

    try {
      const matchingUser = users.find(
        (user) => user.email === email && user.password === password && user.role==="customer"
      );
      console.log(matchingUser)

      if (!matchingUser) {
        setLogin({ ...login, password: "" });
        setSnackbar({
          open: true,
          message: "Invalid login credentials",
          severity: "error",
        });
        return;
      }

      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(matchingUser));

        setSnackbar({
          open: true,
          message: data.message || "Login successful!",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        setSnackbar({
          open: true,
          message: "Login failed, invalid credentials",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div>
      <Container fluid className="py-5">
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            <img
              src={sideImage}
              alt="Sign Up"
              className="img-fluid rounded"
              style={{ maxHeight: "650px" }}
            />
          </Col>
          <Col md={6} className="d-flex justify-content-center">
            <div style={{ maxWidth: "400px" }}>
              <h1 className="fw-bold mb-4" style={{ fontSize: "2.5rem" }}>
                Log in to Exclusive
              </h1>
              <p className="text-muted mb-4">Enter your details below</p>

              <form onSubmit={handleLogin} className="space-y-4 w-80">
                <input
                  type="email"
                  placeholder="Email or Phone Number"
                  name="email"
                  value={email}
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={changefun}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={changefun}
                />
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <button
                    type="submit"
                    className="py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none"
                  >
                    Login
                  </button>
                  <Link
                    to="/userforgotpasswordpage"
                    className="text-red-500 mb-0"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>

              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;
