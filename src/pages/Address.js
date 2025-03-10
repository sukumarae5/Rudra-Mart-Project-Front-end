import React, { useState, useEffect } from "react";
import {
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import { FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Address = ({ scrollToOrderSummary }) => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Payment-related states (unchanged)
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  }); // Reusable function to fetch saved addresses
  const fetchSavedAddresses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.10:8081/api/address/get", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSavedAddresses(data.addresses);
      } else {
        setError(data.message || "Failed to fetch saved addresses.");
      }
    } catch (err) {
      setError("An error occurred while fetching saved addresses.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSavedAddresses();
  }, [navigate]);
  // Cancel handler for both Add and Edit forms
  const handleCancel = () => {
    setNewAddress(false);
    setSelectedAddress(null);
    setFormData({
      full_name: "",
      phone_number: "",
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    });
  };
  // Handler for adding a new address (POST)
  const handleAddAddress = async (e) => {
    e.preventDefault();
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    console.log(userId);
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }
    if (!userId) {
      alert("User ID is not available.");
      return;
    }
    // Validate that every field is filled
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        alert(`Please fill in the ${key.replace("_", " ")}`);
        return;
      }
    }
    setLoading(true);
    try {
      // Build payload with keys expected by backend:
      // Map street_address → address and postal_code → postalcode.
      const payload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address: formData.street_address,
        city: formData.city,
        state: formData.state,
        postalcode: formData.postal_code,
        country: formData.country,
        userId: userId,
      };
      const response = await fetch("http://192.168.1.10:8081/api/address/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Address added successfully!");
        // Reload addresses automatically
        fetchSavedAddresses();
        handleCancel();
      } else {
        alert(data.message || "Failed to add address.");
      }
    } catch (err) {
      alert("An error occurred while adding the address.");
    } finally {
      setLoading(false);
    }
  }; // Handler for updating an existing address (PUT)
  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    if (!selectedAddress || !selectedAddress.id) {
      alert("No address selected for update.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user.id);
    if (!token && user?.id) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: JSON.parse(selectedAddress.id),
        userId: user.id,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address: formData.street_address, // Match backend field name
        city: formData.city,
        state: formData.state,
        postalcode: formData.postal_code, // Match backend field name
        country: formData.country,
      };
      const response = await fetch(
        `http://192.168.1.10:8081/api/address/updateaddress/${selectedAddress.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Address updated successfully!");
        fetchSavedAddresses();
        handleCancel();
      } else {
        alert(data.message || "Failed to update address.");
      }
    } catch (err) {
      alert("An error occurred while updating the address.");
    } finally {
      setLoading(false);
    }
  };
  // Handler for deleting an address
  const handleDeleteAddress = async (addressId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (confirmDelete) {
      setLoading(true);
      try {
        const response = await fetch(
          `http://192.168.1.10:8081/api/address/delete/${addressId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          alert("Address deleted successfully!");
          fetchSavedAddresses();
        } else {
          alert(data.message || "Failed to delete address.");
        }
      } catch (err) {
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }; // When editing, populate the form with the address data.
  const handleEditAddress = (address) => {
    console.log("Editing address:", address); // Debugging
    setSelectedAddress(address);
    setFormData({
      id: address.id || "",
      full_name: address.full_name || "",
      phone_number: address.phone_number || "",
      street_address: address.street_address || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "",
    });
    setNewAddress(true);
  }; // Update form state when an input changes.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; // (Optional) Select an address for payment.
  const handleSelectAddressForPayment = (address) => {
    setSelectedAddress(address);
  };
  useEffect(() => {
    if (savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses[0]);
    }
  }, [savedAddresses]);
  return (
    <Container
      fluid
      style={{ background: "#e3f2fd", padding: "10px 0px 0px 50px" }}
    >
      <Row className="justify-content-center my-2">
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <FaHome />
              Select The Address
            </Accordion.Header>
            <Accordion.Body>
              {/* Address Section */}
              <Col
                md={12}
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  marginBottom: "20px",
                }}
              >
                <h3 className="text-primary mb-4 d-flex align-items-center">
                  <FaMapMarkerAlt className="mr-2" /> Delivery Address
                </h3>
                {loading && <Spinner animation="border" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {savedAddresses.length > 0 ? (
                  savedAddresses.map((addr) => (
                    <div>
                      <Card key={addr.id} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <Form.Check
                                type="radio"
                                name="address"
                                checked={selectedAddress?.id === addr.id}
                                onChange={() => {
                                  handleSelectAddressForPayment(addr);
                                  if (selectedAddress?.id === addr.id) {
                                    localStorage.setItem(
                                      "addressId",
                                      selectedAddress.id
                                    );
                                  } else {
                                    localStorage.removeItem("addressId");
                                  }
                                }}
                                label={
                                  <>
                                    <strong>{addr.full_name}</strong> (
                                    {addr.phone_number})
                                    <br />
                                    {addr.street_address}, {addr.city},{" "}
                                    {addr.state}, {addr.postal_code},{" "}
                                    {addr.country},{" "}
                                    {handleSelectAddressForPayment}
                                  </>
                                }
                              />
                            </div>
                            <div>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleEditAddress(addr)}
                                className="mr-2"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteAddress(addr.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">
                    No saved addresses. Please add a new address.
                  </p>
                )}
                <Button
                  variant="link"
                  className="text-primary"
                  onClick={() => {
                    setNewAddress(true);
                    setSelectedAddress(null);
                    setFormData({
                      full_name: "",
                      phone_number: "",
                      street_address: "",
                      city: "",
                      state: "",
                      postal_code: "",
                      country: "",
                    });
                  }}
                >
                  + Add New Address
                </Button>
                <div className="d-flex justify-content-end">
                  <Button
                    onClick={() => {
                      if (selectedAddress?.id) {
                        localStorage.setItem("addressId", selectedAddress.id);
                        scrollToOrderSummary();
                      } else {
                        alert("Please select an address before continuing.");
                      }
                    }}
                    className="px-4 py-2 fw-bold"
                  >
                    Next
                  </Button>
                </div>{" "}
                {/* Form for Adding a New Address */}
                {newAddress && !selectedAddress && (
                  <Card className="mt-3">
                    <Card.Body>
                      <h4 className="text-primary mb-3">Add New Address</h4>
                      <Form onSubmit={handleAddAddress}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Street Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="street_address"
                            value={formData.street_address}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <div className="d-flex">
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? "Saving..." : "Save Address"}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={loading}
                            className="ml-2"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}
                {/* Form for Editing an Address */}
                {newAddress && selectedAddress && (
                  <Card className="mt-3">
                    <Card.Body>
                      <h4 className="text-primary mb-3">Edit Address</h4>
                      <Form onSubmit={handleUpdateAddress}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Street Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="street_address"
                            value={formData.street_address}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <div className="d-flex">
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? "Updating..." : "Update Address"}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={loading}
                            className="ml-2"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}
              </Col>
              {/* Order Summary & Payment Section */}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
    </Container>
  );
};

export default Address;
