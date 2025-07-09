import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateCategoryRequest,
  fetchCategoryByIdRequest,
} from "../../features/categories/categoriesAction";

const EditCategoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedCategory, loading, success } = useSelector(
    (state) => state.categoryproducts
  );

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    active: true,
    featured: false,
  });

  // Fetch category on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryByIdRequest(id));
    }
  }, [dispatch, id]);

  // Populate form when data is fetched
  useEffect(() => {
    if (selectedCategory && String(selectedCategory.id) === String(id)) {
      setFormData({
        name: selectedCategory.name || "",
        slug: selectedCategory.slug || "",
        description: selectedCategory.description || "",
        image_url: selectedCategory.image_url || "",
        active: selectedCategory.active === 1,
        featured: selectedCategory.featured === 1,
      });
    }
  }, [selectedCategory, id]);

  // Handle success state
  useEffect(() => {
    if (success) {
      alert("Category updated successfully!");
      navigate("/admin/categories");
    }
  }, [success, navigate]);

  // Auto-generate slug when name changes
  useEffect(() => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  }, [formData.name]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      active: formData.active ? 1 : 0,
      featured: formData.featured ? 1 : 0,
    };
    dispatch(updateCategoryRequest(id, payload));
  };

  return (
    <div className="container p-4">
      <h4 className="mb-4">Edit Category</h4>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="name">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="slug">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={formData.slug}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </Form.Group>

        <Form.Group controlId="image_url" className="mb-3">
          <Form.Label>Image URL *</Form.Label>
          <Form.Control
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row className="mb-4">
          <Col md={2}>
            <Form.Check
              type="switch"
              label="Active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Check
              type="switch"
              label="Featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/admin/categories")}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Category"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditCategoryForm;