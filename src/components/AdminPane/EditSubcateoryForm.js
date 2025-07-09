import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateSubcategoryRequest,
  fetchSubcategoryByIdRequest,
} from "../../features/subcategories/subcategoryAction";
import { fetchProductCategoryRequest } from "../../features/categories/categoriesAction";

const EditSubcategoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedSubcategory, loading, success } = useSelector(
    (state) => state.subcategory
  );
  const categories = useSelector(
    (state) => state.categoryproducts.categoryproduct || []
  );

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    slug: "",
    image_url: "",
    active: true,
    featured: false,
  });

  // Fetch subcategory and categories
  useEffect(() => {
    dispatch(fetchSubcategoryByIdRequest(id));
    dispatch(fetchProductCategoryRequest());
  }, [dispatch, id]);

  // Set default values when subcategory is loaded
  useEffect(() => {
    if (
      selectedSubcategory &&
      parseInt(selectedSubcategory.id) === parseInt(id)
    ) {
      setFormData({
        category_id: selectedSubcategory.category_id || "",
        name: selectedSubcategory.name || "",
        slug: selectedSubcategory.slug || "",
        image_url: selectedSubcategory.image_url || "",
        active: selectedSubcategory.active === 1,
        featured: selectedSubcategory.featured === 1,
      });
    }
  }, [selectedSubcategory, id]);

  // Navigate on success
  useEffect(() => {
    if (success) {
      alert("Subcategory updated successfully!");
      navigate("/admin/subcategories");
    }
  }, [success, navigate]);

  // Auto-generate slug on name change
  useEffect(() => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  }, [formData.name]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      active: formData.active ? 1 : 0,
      featured: formData.featured ? 1 : 0,
    };
    dispatch(updateSubcategoryRequest(id, payload));
  };

  return (
    <div className="container p-4">
      <h4>Edit Subcategory</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Category *</Form.Label>
          <Form.Select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
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
            <Form.Group>
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

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </Form.Group>

        <Row className="mb-3">
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
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/subcategories")}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Subcategory"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditSubcategoryForm;
