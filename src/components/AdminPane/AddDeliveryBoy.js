import React, { useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addDeliveryBoyRequest } from "../../features/deliveryboydetails/deliveryBoyActions";

const AddDeliveryBoyPage = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", status: "Active" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // ✅
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    dispatch(addDeliveryBoyRequest(formData));
    setSuccess(true); // ✅
    setTimeout(() => navigate("/admin/admindeliverypage"), 1500); // redirect
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        <h3 className="mb-3">Add Delivery Boy</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
            Delivery Boy Added Successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control name="phone" value={formData.phone} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Delivery Boy
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddDeliveryBoyPage;
