import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Form, Button,  Spinner, Alert } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const CheckoutPage = () => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    postalcode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch saved addresses
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }

    const fetchSavedAddresses = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://192.168.1.12:3000/api/address/get", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setSavedAddresses(data.addresses);
        } else {
          setError(data.message || "Failed to fetch saved addresses.");
        }
      } catch (error) {
        setError("An error occurred while fetching saved addresses.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedAddresses();
  }, [navigate]);

  // Handle new address submission
  const handleAddressSubmit = async () => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;  // Safely get the id
  
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }
  
    if (!userId) {
      alert("User ID is not available.");
      return;
    }
  
    // Check if all form fields are filled out
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        alert(`Please fill in the ${key.replace('_', ' ')}`);
        return;
      }
    }
  
    setLoading(true);
    try {
      // URL for the API call depending on whether it's an update or add
      const url = selectedAddress
        ? `http://192.168.1.12:3000/api/address/update/${selectedAddress.id}`  // Include the address ID in the URL for update
        : "http://192.168.1.12:3000/api/address/add";  // Add new address if no address is selected
  
      const method = selectedAddress ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          userId: userId,  // Include userId in the request body
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        alert(selectedAddress ? "Address updated successfully!" : "Address added successfully!");
  
        // Update the saved addresses
        setSavedAddresses((prev) =>
          selectedAddress
            ? prev.map((addr) => (addr.id === selectedAddress.id ? data.address : addr))
            : [...prev, data.address]
        );
  
        // Reset form and selection state after successful operation
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
      } else {
        alert(data.message || "Failed to save address.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Handle address edit
  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setFormData({
      full_name: address.full_name,
      phone_number: address.phone_number,
      address: address.street_address,
      city: address.city,
      state: address.state,
      postalcode: address.postal_code,
      country: address.country,
    });
    setNewAddress(true);
  };

  // Handle address delete
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
        const response = await fetch(`http://192.168.1.12:3000/api/address/delete/${addressId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          alert("Address deleted successfully!");
          setSavedAddresses((prev) => prev.filter((address) => address.id !== addressId));
        } else {
          alert(data.message || "Failed to delete address.");
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectAddressForPayment = (address) => {
    setSelectedAddress(address);
  };


  return (
    <Container fluid style={{ minHeight: "100vh", background: "#e3f2fd", padding: "50px" }}>
      <Row>
        {/* Address Section */}
        <Col md={6} style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
          <h3 className="text-blue-700 font-semibold mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2" /> Delivery Address
          </h3>
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {savedAddresses.length > 0 ? (
            savedAddresses.map((addr) => (
              <div key={addr.id} className="border p-2 rounded-lg mb-2 cursor-pointer hover:bg-blue-50">
                <input type="radio" name="address" checked={selectedAddress?.id === addr.id} onChange={() => handleSelectAddressForPayment(addr)} className="mr-2" />
                <span className="font-semibold">{addr.full_name}</span> ({addr.phone_number}) <br />
                <span>{addr.street_address}, {addr.city}, {addr.state}, {addr.postal_code}, {addr.country}</span>
                <div className="d-flex mt-2">
                  <Button variant="warning" onClick={() => handleEditAddress(addr)} className="mr-2">Edit</Button>
                  <Button variant="danger" onClick={() => handleDeleteAddress(addr.id)}>Delete</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No saved addresses. Please add a new address.</p>
          )}

          <Button variant="link" className="text-blue-500" onClick={() => setNewAddress(true)}>+ Add New Address</Button>

          {/* Form for adding new address */}
          {newAddress && !selectedAddress && (
            <div className="border p-4 rounded-lg mt-3">
              <h3 className="text-lg font-semibold text-blue-700">Enter New Address</h3>
              <Form>
                {Object.keys(formData).map((key) => (
                  <Form.Group className="mb-3" key={key}>
                    <Form.Label>{key.replace("_", " ")}</Form.Label>
                    <Form.Control type="text" name={key} value={formData[key]} onChange={handleChange} required />
                  </Form.Group>
                ))}
                <Button variant="primary" onClick={handleAddressSubmit} disabled={loading}>
                  {loading ? "Saving..." : "Save Address"}
                </Button>
              </Form>
            </div>
          )}

          {/* Form for editing an existing address */}
          {newAddress && selectedAddress && (
            <div className="border p-4 rounded-lg mt-3">
              <h3 className="text-lg font-semibold text-blue-700">Edit Address</h3>
              <Form>
                {Object.keys(formData).map((key) => (
                  <Form.Group className="mb-3" key={key}>
                    <Form.Label>{key.replace("_", " ")}</Form.Label>
                    <Form.Control type="text" name={key} value={formData[key]} onChange={handleChange} required />
                  </Form.Group>
                ))}
                <Button variant="primary" onClick={handleAddressSubmit} disabled={loading}>
                  {loading ? "Updating..." : "Update Address"}
                </Button>
              </Form>
            </div>
          )}
        </Col>

        {/* Payment Section */}
        <Col md={6}>
          
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
