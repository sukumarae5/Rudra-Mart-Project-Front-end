import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addUserRequest } from "../../features/user/userActions";

const AddUserForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { addUserSuccess, addUserError } = useSelector((state) => state.users);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phonenumber: "",
  });

  useEffect(() => {
    if (addUserSuccess) {
      alert(addUserSuccess);
      navigate("/admin/adminusers");
    }
  }, [addUserSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(newUser);
    const { name, email, phonenumber } = newUser;

    if (!name || !email || !phonenumber) {
      alert("All fields (Name, Email, PhoneNumber) are required.");
      return;
    }

    dispatch(addUserRequest(newUser));
  };

  return (
    <div className="container mt-4">
      {/* Top Navigation */}
      <Row className="align-items-center mb-3">
        <Col xs={6}>
          <Button
            variant="link"
            onClick={() => navigate("/admin/adminusers")}
            className="text-primary d-flex align-items-center"
            style={{ fontSize: "1.2rem", gap: "5px" }}
          >
            <IoArrowBack size={24} />
            <span>Back</span>
          </Button>
          <h1
            className="mt-2"
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#131523" }}
          >
            New User
          </h1>
        </Col>
        <Col xs={6} className="text-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/adminusers")}
            className="me-2"
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Col>
      </Row>

      {/* Form Section */}
      <div className="card p-4 shadow-sm">
        {addUserError && <Alert variant="danger">{addUserError}</Alert>}
        <Form>
          <Form.Group className="mb-3" controlId="userName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleChange}
              placeholder="Enter user name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="userEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="userPhonenumber">
            <Form.Label>Phone number</Form.Label>

            <Form.Control
              type="text"
              name="phonenumber" // ✅ Match the state key
              value={newUser.phonenumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default AddUserForm;