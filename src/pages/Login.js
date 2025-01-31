import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import sideImage from "../../src/assets/images/cart.jpg";
import { Link, useNavigate } from "react-router-dom";
import { fetchusersrequest } from "../features/user/userActions";
import { useDispatch, useSelector } from "react-redux";


const Login = () => {
  
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
  const dispatch = useDispatch();
  const { users = [], error = null } = useSelector((state) => state.users);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Users from Redux on Component Render:", users);
  }, [users]);

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const { email, password } = login;

  const changefun = async (e) => {
    await setLogin({ ...login, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(fetchusersrequest());
  }, [dispatch]);
  
  console.log(login)
  const sub = (e) => {
    e.preventDefault();

    if (login.email === adminEmail && login.password === adminPassword) {
      alert("Admin Login Successful!");
      navigate("/admin");
    } else {
      const matchingUser = users.find(
        (user) => user.email === login.email && user.password === login.password
      );

      if (matchingUser) {
        alert("Login successful:", matchingUser);
        navigate("/");
      } else {
        console.log("Login failed:", error || "Invalid email or password");
      }
    }
   
    console.log("Login form submitted:", login);
    // Dispatch action to fetch users
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

              <form onSubmit={sub} className="space-y-4 w-80">
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
                    className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    Login
                  </button>
                  <Link to="/forgot-password" className="text-red-500 mb-0">
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
