import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addSubcategoryRequest } from '../../features/subcategories/subcategoryAction';

const AddSubcategoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Select category list from categoryproducts reducer
  const categoryState = useSelector((state) => state.categoryproducts);
  const subcategoryState = useSelector((state) => state.subcategory);

  const categories = Array.isArray(categoryState?.categoryproduct)
    ? categoryState.categoryproduct
    : [];

  const { loading, success } = subcategoryState;

  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    slug: '',
    image_url: '',
    active: true,
    featured: false,
  });

  // ✅ Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name]);

  // ✅ Fetch categories from backend
  useEffect(() => {
    dispatch({ type: "FETCH_PRODUCTS_CATEGORY_REQUEST" }); // must match your saga
  }, [dispatch]);

  // ✅ Redirect if success
  useEffect(() => {
    if (success) {
      alert("Subcategory added successfully!");
      navigate('/admin/categories');
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      active: formData.active ? 1 : 0,
      featured: formData.featured ? 1 : 0,
    };

    dispatch(addSubcategoryRequest(payload));
  };

  return (
    <div className="container p-4">
      <h4 className="mb-3">Add Subcategory</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="subcategoryCategory" className="mb-3">
          <Form.Label>Category *</Form.Label>
          <Form.Select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="subcategoryName">
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
            <Form.Group controlId="subcategorySlug">
              <Form.Label>Slug *</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="subcategoryImage" className="mb-3">
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
              id="subActiveSwitch"
              name="active"
              label="Active"
              checked={formData.active}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Check
              type="switch"
              id="subFeaturedSwitch"
              name="featured"
              label="Featured"
              checked={formData.featured}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/admin/subcategories')}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Subcategory'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddSubcategoryForm;
