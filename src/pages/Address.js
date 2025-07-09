import React, { useState, useEffect } from "react";
import {
  Spinner,
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const MuiSnackbarAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
MuiSnackbarAlert.displayName = "MuiSnackbarAlert";

const Address = () => {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);

  const initialFormState = {
    full_name: "",
    phone_number: "",
    pincode: "",
    house_no: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    address_type: "Home",
    is_default: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const showAlert = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const fetchSavedAddresses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showAlert("Please log in first.", "warning");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/address/get`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setSavedAddresses(data.addresses);
      } else {
        showAlert(data.message || "Failed to fetch saved addresses.", "error");
      }
    } catch (err) {
      showAlert("Error fetching saved addresses.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const handleCancel = () => {
    setNewAddress(false);
    setSelectedAddress(null);
    setFormData(initialFormState);
  };

  const handleAddOrUpdateAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (!token || !userId) {
      showAlert("Login required.", "warning");
      navigate("/login");
      return;
    }

    for (const [key, value] of Object.entries(formData)) {
      if (value === "" || value === null || value === undefined) {
        showAlert(`Please fill in the ${key.replace("_", " ")}`, "warning");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = { ...formData, user_id: userId };
      const method = selectedAddress ? "PUT" : "POST";
      const url = selectedAddress
        ? `http://${process.env.REACT_APP_IP_ADDRESS}/api/address/updateaddress/${selectedAddress.id}`
        : `http://${process.env.REACT_APP_IP_ADDRESS}/api/address/add`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showAlert(
          `Address ${selectedAddress ? "updated" : "added"} successfully!`
        );
        fetchSavedAddresses();
        handleCancel();
      } else {
        showAlert(data.message || "Operation failed.", "error");
      }
    } catch (err) {
      showAlert("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showAlert("Login required.", "warning");
      navigate("/login");
      return;
    }
    if (window.confirm("Are you sure you want to delete this address?")) {
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
          showAlert(data.message || "Failed to delete address.", "error");
        }
      } catch (err) {
        showAlert("An error occurred. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setFormData({ ...address });
    setNewAddress(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectAddressForPayment = (address) => {
    setSelectedAddress(address);
    localStorage.setItem("addressId", address.id);
  };

  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddress) {
      setSelectedAddress(savedAddresses[0]);
    }
  }, [savedAddresses]);

  return (
    <Container fluid className="py-4 px-3" style={{ backgroundColor: "#f7f7f7" }}>
      <Row className="justify-content-center">
        <Col md={12} className="bg-white rounded shadow-sm p-4">
          <h3 className="mb-4 d-flex align-items-center">
            <FaMapMarkerAlt className="me-2 text-danger" />
            <span
              style={{
                backgroundColor: "#fff3cd",
                padding: "4px 8px",
                borderRadius: "6px",
                fontWeight: "bold",
                color: "#d35400",
              }}
            >
              Delivery Address
            </span>
          </h3>

          {loading && <Spinner animation="border" />}

          {savedAddresses.length > 0 ? (
            savedAddresses.map((addr) => (
              <Card
                key={addr.id}
                className={`mb-3 ${selectedAddress?.id === addr.id ? "border-primary" : ""}`}
              >
                <Card.Body className="d-flex justify-content-between align-items-start">
                  <Form.Check
                    type="radio"
                    name="address"
                    checked={selectedAddress?.id === addr.id}
                    onChange={() => handleSelectAddressForPayment(addr)}
                    label={
                      <>
                        <strong>{addr.full_name}</strong> ({addr.phone_number})<br />
                        {addr.house_no}, {addr.street}, {addr.landmark}, {addr.city},{" "}
                        {addr.state}, {addr.pincode}, {addr.country}
                      </>
                    }
                  />
                  <div>
                    <Button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditAddress(addr)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteAddress(addr.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No saved addresses. Please add one.</p>
          )}

          <Button
            variant="link"
            className="text-primary mb-3"
            onClick={() => {
              setNewAddress(true);
              setSelectedAddress(null);
              setFormData(initialFormState);
            }}
          >
            + Add New Address
          </Button>

          {newAddress && (
            <Card className="mt-4">
              <Card.Body>
                <Form onSubmit={handleAddOrUpdateAddress}>
                  <Row>
                    {Object.keys(initialFormState).map((field) => {
                      if (field === "is_default") {
                        return (
                          <Col md={6} key={field} className="mb-3">
                            <Form.Check
                              type="checkbox"
                              label="Set as Default"
                              name={field}
                              checked={formData[field]}
                              onChange={handleChange}
                            />
                          </Col>
                        );
                      }
                      if (field === "address_type") {
                        return (
                          <Col md={6} key={field} className="mb-3">
                            <Form.Label>Address Type</Form.Label>
                            <Form.Select
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                            >
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                            </Form.Select>
                          </Col>
                        );
                      }
                      return (
                        <Col md={6} key={field} className="mb-3">
                          <Form.Label>
                            {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      );
                    })}
                  </Row>
                  <div className="d-flex">
                    <Button type="submit" className="fw-bold">
                      {loading ? "Saving..." : selectedAddress ? "Update" : "Save"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="ms-2"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          <div className="d-flex justify-content-end mt-4">
            <Button
              className="fw-bold"
              onClick={() => {
                if (savedAddresses.length === 0) {
                  showAlert("Please add an address.", "warning");
                  return;
                }
                if (!selectedAddress?.id) {
                  showAlert("Please select an address.", "warning");
                  return;
                }
                localStorage.setItem("addressId", selectedAddress.id);
                navigate("/ordersummarypage");
              }}
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>

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