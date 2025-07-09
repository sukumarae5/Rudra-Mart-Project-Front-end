import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBannerRequest } from "../../features/banners/bannerActions";

const AddBannerForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.banners || {}); // Safe destructure

  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    description: "",
    offers: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBannerRequest(formData));
    if (success) {
      alert("Banner added successfully!");
      navigate("/admin/adminbanners");
    }
    if (error) {
      alert("Failed to add banner: " + error);
    }
  };

  return (
    <Container fluid className="p-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-2 fw-bold">Add New Banner</h4>
        <p className="text-muted mb-4">
          Create a new banner to display on the homepage
        </p>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Banner Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Groceries delivered in 10 mins"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Offers</Form.Label>
            <Form.Control
              type="text"
              name="offers"
              value={formData.offers}
              onChange={handleChange}
              placeholder="e.g., Flash sales up to 10% off"
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/banners")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : "Save Banner"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddBannerForm;
