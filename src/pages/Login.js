import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchusersrequest } from "../features/user/userActions";
import sideImage from "../../src/assets/images/cart.jpg";

const Login = () => {
  const dispatch = useDispatch();
  const { users = [] } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const { email, password } = login;
  const changefun = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    dispatch(fetchusersrequest());
  }, [dispatch]);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const matchingUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (matchingUser) {
        const response = await fetch("http://192.168.1.9:8081/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        console.log(data)
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(matchingUser));
          alert(data.message);
          navigate("/");

          setTimeout(() => {
            window.location.reload(); // Ensure one-time refresh for updates
          }, 500);
        } else {
          setError("Login failed, invalid credentials");
        }
      } else {
        setError("Invalid login credentials");
      }

      const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
      if (email === adminEmail && password === adminPassword) {
        alert("Admin Login Successful!");
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
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
              {!userData ? (
                <>
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
                      <Link to="/forgot-password" className="text-red-500 mb-0">
                        Forgot Password?
                      </Link>
                    </div>
                  </form>
                </>
              ) : (
                <div>
                  <h1>Welcome, {userData.name}</h1>
                  <p>Email: {userData.email}</p>
                  <p>Token: {localStorage.getItem("authToken")}</p>
                  <p>Profile Details: </p>
                  <pre>{JSON.stringify(userData, null, 2)}</pre>
                </div>
              )}

              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
