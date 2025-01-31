import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";

const EditUserForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {}; // Get user data from state

  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setUpdatedUser({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        password: "", // Leave blank for security
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (!user?.id) {
    console.error("User ID is missing.");
    return <p>Error: User data is missing.</p>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !updatedUser.name ||
      !updatedUser.email ||
      !updatedUser.password ||
      !updatedUser.phone_number ||
      !updatedUser.role
    ) {
      alert("All fields (Name, Email, Password, Phone Number, Role) are required.");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.6:3000/api/users/update/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to update user"}`);
        return;
      }

      alert("User updated successfully!");
      navigate("/admin/adminusers"); // Redirect after update
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error: Could not update user");
    }
  };

  return (
    <div className="container-fluid">
      {/* Header: Back Button */}
      <Row className="align-items-center mb-3">
        <Col xs={6} className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={() => navigate('/admin/adminusers')}
            className="text-primary d-flex align-items-center"
            style={{ fontSize: "1.2rem", gap: "8px" }}
          >
            <IoArrowBack size={24} />
            <span>Back</span>
          </Button>
        </Col>
      </Row>

      {/* Edit User Title and Buttons on Same Line */}
      <Row className="align-items-center mb-3">
        {/* Title - Left */}
        <Col xs={6}>
          <h1 className="text-start" style={{ fontSize: "2rem", color: "#007bff", fontWeight: "bold" }}>
            Edit User
          </h1>
        </Col>

        {/* Buttons - Right */}
        <Col xs={6} className="d-flex justify-content-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/adminusers")}
            className="me-2"
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Col>
      </Row>

      {/* Edit User Form */}
      <Form onSubmit={handleSubmit} className="p-3 border rounded">
        <Form.Group className="mb-3" controlId="userName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={updatedUser.name}
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
            value={updatedUser.email}
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
            value={updatedUser.phone_number}
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
            value={updatedUser.password}
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
            value={updatedUser.role}
            onChange={handleChange}
            placeholder="Enter user role"
            required
          />
        </Form.Group>

        {/* Bottom Save/Cancel Buttons */}
        <Row className="mt-4">
          <Col xs={6} className="text-start">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/adminusers")}
            >
              Cancel
            </Button>
          </Col>
          <Col xs={6} className="text-end">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditUserForm;
