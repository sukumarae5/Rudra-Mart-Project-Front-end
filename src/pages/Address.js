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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaHome } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const MuiSnackbarAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

  // Snackbar state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const fetchSavedAddresses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showAlert('Please log in first.', 'warning');
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/address/get`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSavedAddresses(data.addresses);
      } else {
        showAlert(data.message || "Failed to fetch saved addresses.", 'error');
      }
    } catch (err) {
      showAlert("An error occurred while fetching saved addresses.", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedAddresses();
  }, [navigate]);

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

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (!token) {
      showAlert('Please log in first.', 'warning');
      navigate("/login");
      return;
    }
    if (!userId) {
      showAlert('User ID not found.', 'warning');
      return;
    }

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        showAlert(`Please fill in the ${key.replace("_", " ")}`, 'warning');
        return;
      }
    }

    setLoading(true);
    try {
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
      const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/address/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showAlert("Address added successfully!");
        fetchSavedAddresses();
        handleCancel();
      } else {
        showAlert(data.message || "Failed to add address.", 'error');
      }
    } catch (err) {
      showAlert("An error occurred while adding the address.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!selectedAddress || !selectedAddress.id) {
      showAlert("No address selected for update.", 'warning');
      return;
    }
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user?.id) {
      showAlert("You need to log in first.", 'warning');
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: selectedAddress.id,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address: formData.street_address,
        city: formData.city,
        state: formData.state,
        postalcode: formData.postal_code,
        country: formData.country,
      };
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/address/updateaddress/${selectedAddress.id}`,
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
        showAlert("Address updated successfully!");
        fetchSavedAddresses();
        handleCancel();
      } else {
        showAlert(data.message || "Failed to update address.", 'error');
      }
    } catch (err) {
      showAlert("An error occurred while updating the address.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showAlert("You need to log in first.", 'warning');
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
          `http://${process.env.REACT_APP_IP_ADDRESS}/api/address/delete/${addressId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          showAlert("Address deleted successfully!");
          fetchSavedAddresses();
        } else {
          showAlert(data.message || "Failed to delete address.", 'error');
        }
      } catch (err) {
        showAlert("An error occurred. Please try again.", 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setFormData({
      id: address.id || "",
      full_name: address.full_name || "",
      phone_number: address.phone_number || "",
      street_address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postalcode || "",
      country: address.country || "",
    });
    setNewAddress(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      style={{ background: "#e3f2fd", padding: "10px 0px 0px 40px", width: "97%" }}
    >
      <Row className="justify-content-center my-2">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <FaHome />
              Select The Address
            </Accordion.Header>
            <Accordion.Body>
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
                                localStorage.setItem("addressId", addr.id);
                              }}
                              label={
                                <>
                                  <strong>{addr.full_name}</strong> ({addr.phone_number})
                                  <br />
                                  {addr.address}, {addr.city}, {addr.state}, {addr.postalcode}, {addr.country}
                                </>
                              }
                            />
                          </div>
                          <div>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleEditAddress(addr)}
                              className="me-2"
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
                        showAlert("Please select an address before continuing.", "warning");
                      }
                    }}
                    className="px-4 py-2 fw-bold"
                  >
                    Next
                  </Button>
                </div>

                {newAddress && (
                  <Card className="mt-3">
                    <Card.Body>
                      <h4 className="text-primary mb-3">
                        {selectedAddress ? "Edit Address" : "Add New Address"}
                      </h4>
                      <Form onSubmit={selectedAddress ? handleUpdateAddress : handleAddAddress}>
                        {["full_name", "phone_number", "street_address", "city", "state", "postal_code", "country"].map((field) => (
                          <Form.Group className="mb-3" key={field}>
                            <Form.Label>{field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</Form.Label>
                            <Form.Control
                              type="text"
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        ))}
                        <div className="d-flex">
                          <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (selectedAddress ? "Updating..." : "Saving...") : (selectedAddress ? "Update Address" : "Save Address")}
                          </Button>
                          <Button variant="secondary" onClick={handleCancel} disabled={loading} className="ms-2">
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>

      {/* Snackbar for alerts */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiSnackbarAlert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </MuiSnackbarAlert>
      </Snackbar>
    </Container>
  );
};

export default Address;
