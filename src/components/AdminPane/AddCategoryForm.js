import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addCategoryRequest, resetCategoryStatus } from "../../features/categories/categoriesAction";
import { useNavigate } from "react-router-dom";
import { fetchCategoryTitlesRequest } from "../../features/categorytitle/categoryActions";

const AddCategoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success } = useSelector((state) => state.categoryproducts);
  const categoryTitleState = useSelector((state) => state.categorytitle.titles);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    active: true,
    featured: false,
    category_title_id: "",
  });

  // Fetch category titles on mount
  useEffect(() => {
    dispatch(fetchCategoryTitlesRequest());
  }, [dispatch]);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name]);

  // On form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      image_url: formData.image_url,
      active: formData.active ? 1 : 0,
      featured: formData.featured ? 1 : 0,
      category_title_id: formData.category_title_id,
    };

    dispatch(addCategoryRequest(payload));
  };

useEffect(() => {
  if (success) {
    alert("Category added successfully!");
    dispatch(resetCategoryStatus()); // ✅ reset success
    navigate(-1);
  }
}, [success, navigate, dispatch]);


  return (
    <div className="container p-4">
      <h4 className="mb-3">Add Category</h4>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="categoryName">
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
            <Form.Group controlId="categorySlug">
              <Form.Label>Slug *</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={formData.slug}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="categoryDescription" className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="categoryImageUrl" className="mb-3">
          <Form.Label>Image URL *</Form.Label>
          <Form.Control
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
            placeholder="https://example.com/image.jpg"
          />
        </Form.Group>

        <Form.Group controlId="categoryTitleId" className="mb-3">
          <Form.Label>Category Title *</Form.Label>
          <Form.Select
            name="category_title_id"
            value={formData.category_title_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Title --</option>
            {categoryTitleState.map((title) => (
              <option key={title.id} value={title.id}>
                {title.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="mb-3">
          <Col md={2}>
            <Form.Check
              type="switch"
              id="activeSwitch"
              name="active"
              label="Active"
              checked={formData.active}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Check
              type="switch"
              id="featuredSwitch"
              name="featured"
              label="Featured"
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
            {loading ? "Saving..." : "Save Category"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddCategoryForm;
