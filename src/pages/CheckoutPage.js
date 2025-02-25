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
import { useDispatch, useSelector } from "react-redux";
import { FaMapMarkerAlt, FaRegCreditCard, FaPaypal } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  decreaseQuantity,
  increaseQuantity,
  removeProduct,
} from "../features/cart/cartActions";

const CheckoutPage = () => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  // Local form fields
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
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddress) {
      setSelectedAddress(savedAddresses[0]);
    }
  }, [savedAddresses, selectedAddress]);

  // Reusable function to fetch saved addresses
  const fetchSavedAddresses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.11:3000/api/address/get", {
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
    const token = localStorage.getItem("authAuthToken") || localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
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

      const response = await fetch("http://192.168.1.11:3000/api/address/add", {
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
  };

  // Handler for updating an existing address (PUT)
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
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
      // Build payload according to backend's expectation.
      // Map street_address → address and postal_code → postalcode.
      const payload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address: formData.street_address,
        city: formData.city,
        state: formData.state,
        postalcode: formData.postal_code,
        country: formData.country,
      };
      const response = await fetch(
        `http://192.168.1.11:3000/api/address/update/${selectedAddress.id}`,
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
        // Reload addresses automatically
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
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (confirmDelete) {
      setLoading(true);
      try {
        const response = await fetch(`http://192.168.1.11:3000/api/address/delete/${addressId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
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
  };

  // When editing, populate the form with the address data.
  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setFormData({
      full_name: address.full_name,
      phone_number: address.phone_number,
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
    });
    setNewAddress(true);
  };

  // Update form state when an input changes.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // (Optional) Select an address for payment.
  const handleSelectAddressForPayment = (address) => {
    setSelectedAddress(address);
  };

  // Cart actions.
  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };
  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };
  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct(productId));
  };

  // Payment method handlers.
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  const handleCardDetailChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const totalCost = checkoutData.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address before proceeding to payment.");
      return;
    }
    // For this example, if the payment method is PayPal, we simply redirect to the backend endpoint.
    // You might pass additional information (e.g., selectedAddress details) in a real app.
    if (paymentMethod === "paypal") {
      // Redirect to the payment endpoint (backend should handle session or token authentication)
      window.location.href = "http://localhost:3000/payment";
    } else if (paymentMethod === "creditCard") {
      alert("Credit card payment processing is not implemented in this example.");
    } else if (paymentMethod === "cod") {
      alert("Cash on Delivery selected. Proceed with order confirmation.");
      // Implement order confirmation logic for COD here.
    }
  };


  return (
    <Container fluid style={{ minHeight: "100vh", background: "#e3f2fd", padding: "50px" }}>
      <Row>
        {/* Address Section */}
        <Col
          md={6}
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
              <Card key={addr.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Form.Check
                        type="radio"
                        name="address"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => handleSelectAddressForPayment(addr)}
                        label={
                          <>
                            <strong>{addr.full_name}</strong> ({addr.phone_number})
                            <br />
                            {addr.street_address}, {addr.city}, {addr.state},{" "}
                            {addr.postal_code}, {addr.country}
                          </>
                        }
                      />
                    </div>
                    <div>
                      <Button variant="warning" size="sm" onClick={() => handleEditAddress(addr)} className="mr-2">
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteAddress(addr.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-muted">No saved addresses. Please add a new address.</p>
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

          {/* Form for Adding a New Address */}
          {newAddress && selectedAddress && (
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
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Address"}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} disabled={loading} className="ml-2">
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
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Update Address"}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} disabled={loading} className="ml-2">
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Order Summary & Payment Section */}
        <Col md={6}>
          <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Payment Method</Accordion.Header>
              <Accordion.Body>
                <Card className="p-4 mb-4 shadow-sm">
                  <h4 className="text-success d-flex align-items-center">
                    <FaRegCreditCard className="mr-2" /> Payment Details
                  </h4>
                  <Form>
                    <Form.Check
                      type="radio"
                      label="Credit Card"
                      value="creditCard"
                      checked={paymentMethod === "creditCard"}
                      onChange={handlePaymentMethodChange}
                    />
                    <Form.Check
                      type="radio"
                      label="PayPal"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={handlePaymentMethodChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Cash on Delivery"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={handlePaymentMethodChange}
                    />
                  </Form>
                  {paymentMethod === "creditCard" && (
                    <Card className="mt-3 p-3">
                      <h5>Credit Card Details</h5>
                      <Form.Group className="mb-3">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardDetailChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                        />
                      </Form.Group>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                              type="text"
                              name="expiryDate"
                              value={cardDetails.expiryDate}
                              onChange={handleCardDetailChange}
                              placeholder="MM/YY"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardDetailChange}
                              placeholder="CVV"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card>
                  )}
                  <Button variant="success"onClick={handlePlaceOrder} className="mt-3 w-100">
                    Place Order
                  </Button>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Card className="p-4 shadow-sm">
            <h4 className="text-danger">Order Summary</h4>
            {checkoutData.length > 0 ? (
              checkoutData.map((item) => (
                <Row key={item.id} className="mb-3">
                  <Col xs={3}>
                    <Image src={item.productImage} rounded style={{ width: "100px" }} />
                  </Col>
                  <Col>
                    <div>
                      <Button variant="link" className="p-0" onClick={() => handleRemoveProduct(item.productId)}>
                        <DeleteOutlineOutlinedIcon />
                      </Button>
                      <p>
                        <strong>{item.productName}</strong>
                      </p>
                      <p>Price: ₹{item.productPrice}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Subtotal: ₹{(item.productPrice * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="d-flex">
                      <Button variant="primary" className="mr-2" onClick={() => handleIncreaseQuantity(item.productId)}>
                        +
                      </Button>
                      <Button variant="primary" onClick={() => handleDecreaseQuantity(item.productId)}>
                        -
                      </Button>
                    </div>
                  </Col>
                </Row>
              ))
            ) : (
              <p className="text-muted">No products available in checkout.</p>
            )}
            <hr />
            <h5 className="text-right">Total: ₹{totalCost.toFixed(2)}</h5>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
