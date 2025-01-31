import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const AddUserForm = () => {
  const navigate = useNavigate();

  // State for user data
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.phone_number ||
      !newUser.role
    ) {
      alert(
        "All fields (Name, Email, Password, Phone Number, Role) are required."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.1.6:3000/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to add user"}`);
        return;
      }

      alert("User added successfully!");
      navigate("/admin/adminusers"); // Redirect to users list
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error: Could not add user");
    }
  };

  return (
    <div className="container mt-4">
      {/* Top Section: Back Button & Save/Cancel Buttons */}
      <Row className="align-items-center mb-3">
        <Col xs={6}>
          <Button
            variant="link"
            onClick={() => navigate("/admin/adminusers")}
            className="text-primary d-flex align-items-center"
            style={{ fontSize: "1.2rem", gap: "5px" }} // Adds spacing between icon and text
          >
            <IoArrowBack size={24} />{" "}
            {/* Increased icon size for better visibility */}
            <span>Back</span>
          </Button>

          <Col xs={12} md={6} className="text-md-start text-center">
            <h1
              style={{ fontSize: "2rem", color: "#007bff", fontWeight: "bold" }}
            >
              New Users
            </h1>
          </Col>
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
        <Form onSubmit={handleSubmit}>
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
              placeholder="Enter user email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="userPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone_number"
              value={newUser.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="userPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="userRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              name="role"
              value={newUser.role}
              onChange={handleChange}
              placeholder="Enter user role"
              required
            />
          </Form.Group>
        </Form>
      </div>

      {/* Bottom Section: Save/Cancel Buttons */}
      <Row className="mt-4">
        <Col className="text-end">
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
    </div>
  );
};

export default AddUserForm;
