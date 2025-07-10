import React, { useEffect, useState } from "react";
import { Form, Button, Card, Alert, Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchDeliveryBoysRequest,
  updateDeliveryBoyRequest,
} from "../../features/deliveryboydetails/deliveryBoyActions";

const EditDeliveryBoyPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deliveryBoys, loading } = useSelector((state) => state.deliveryBoy);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    status: "Active",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!deliveryBoys.length) {
      dispatch(fetchDeliveryBoysRequest());
    }
  }, [dispatch, deliveryBoys]);

  useEffect(() => {
    const boy = deliveryBoys.find((b) => b.id.toString() === id);
    if (boy) {
      setFormData({
        name: boy.name || "",
        phone: boy.phone || "",
        status: boy.status || "Active",
      });
    }
  }, [deliveryBoys, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError("Name and phone are required.");
      return;
    }

    dispatch(updateDeliveryBoyRequest(id, formData));
    setSuccess(true);
    setTimeout(() => navigate("/admin/admindeliverypage"), 1500);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        <h3 className="mb-3">Edit Delivery Boy</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
            Delivery Boy updated successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Delivery Boy
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EditDeliveryBoyPage;
