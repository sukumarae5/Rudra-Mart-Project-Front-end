import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

import {
  updateDeliveryRequest,
  fetchDeliveriesRequest,
} from "../../features/delivery/deliveryActions";

import { fetchusersrequest } from "../../features/user/userActions";
import { fetchDeliveryBoysRequest } from "../../features/deliveryboydetails/deliveryBoyActions";

const EditDeliveryPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { deliveries, loading } = useSelector((state) => state.delivery);
  const { deliveryBoys } = useSelector((state) => state.deliveryBoy);
  const users = useSelector((state) => state.users.users);

  const deliveryFromState = state?.delivery;
  const delivery =
    deliveryFromState || deliveries.find((d) => d.id?.toString() === id);

  const [formData, setFormData] = useState({
    delivery_id: "",
    delivery_boy_id: "",
    estimated_time: "",
    status: "Pending",
    order_id: "",
    user_id: "",
  });

  const [initialized, setInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ Success alert

  // Fetch required data
  useEffect(() => {
    dispatch(fetchDeliveriesRequest());
    dispatch(fetchDeliveryBoysRequest());
    dispatch(fetchusersrequest());
  }, [dispatch]);

  // Populate form once delivery is loaded
  useEffect(() => {
    if (delivery && users.length > 0 && !initialized) {
      const matchedUser = users.find(
        (u) =>
          u.name?.toLowerCase().trim() ===
          delivery.customer_name?.toLowerCase().trim()
      );

      setFormData({
        delivery_id: delivery.delivery_id,
        delivery_boy_id: delivery.delivery_boy_id || "",
        estimated_time: delivery.estimated_time || "",
        status: delivery.status || "Pending",
        order_id: delivery.order_id,
        user_id: matchedUser?.id || delivery.user_id || "",
      });

      setInitialized(true);
    }
  }, [delivery, users, initialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.delivery_id && !delivery) {
      alert("Delivery not found.");
      return;
    }

    const updateData = {
      delivery_boy_id: formData.delivery_boy_id || null,
      estimated_time: formData.estimated_time,
      status: formData.status,
      order_id: formData.order_id,
      user_id: formData.user_id,
    };

    dispatch(updateDeliveryRequest(formData.delivery_id, updateData));

    setShowSuccess(true); // ✅ Show success alert
    setTimeout(() => {
      navigate("/admin/admindeliverypage");
    }, 1500);
  };

  if (!delivery && loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">Delivery not found.</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">Edit Delivery #{delivery.delivery_id}</h4>

        {/* ✅ Success Alert */}
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            Delivery updated successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Estimated Time</Form.Label>
                <Form.Control
                  type="text"
                  name="estimated_time"
                  value={formData.estimated_time}
                  onChange={handleChange}
                  placeholder="e.g., 17:00:00"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Delivery Boy</Form.Label>
                <Form.Select
                  name="delivery_boy_id"
                  value={formData.delivery_boy_id}
                  onChange={handleChange}
                >
                  <option value="">Unassigned</option>
                  {deliveryBoys.map((boy) => (
                    <option key={boy.id} value={boy.id}>
                      {boy.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Read-only fields */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  value={delivery.customer_name || "N/A"}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Order ID</Form.Label>
                <Form.Control type="text" value={delivery.order_id} readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={delivery.address || "N/A"}
              readOnly
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Delivery
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditDeliveryPage;
