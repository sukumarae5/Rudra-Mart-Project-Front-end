import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { IoArrowBack } from 'react-icons/io5';

const EditProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  // Initialize state with existing product data
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    image_url: product?.image_url || '',
    category_id: product?.category_id || '',
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for saving the updated product
  const handleSave = async (event) => {
    event.preventDefault();
    if (!product || !product.id) {
      console.error('No product ID available');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/products/updateproduct/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product updated successfully!')
        console.log('Product updated successfully:', data);
        navigate('/admin/adminproducts'); 
      } else {
        alert(`Error: ${data.error || 'Failed to update product'}`)
      }
    } catch (error) {
      console.error('Error updating product:', error.message);
      alert('Error updating product:', error.message)
    }
  };

  return (
    <div className="container-fluid">
      {/* Header: Back Button */}
      <Row className="align-items-center mb-3">
        <Col xs={6} className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={() => navigate('/admin/adminproducts')}
            className="text-primary d-flex align-items-center"
            style={{ fontSize: "1.2rem", gap: "8px" }}
          >
            <IoArrowBack size={24} />
            <span>Back</span>
          </Button>
        </Col>
      </Row>

      {/* Edit Product Title and Buttons on Same Line */}
      <Row className="align-items-center mb-3">
        {/* Title - Left */}
        <Col xs={6}>
          <h1 className="text-start" style={{ fontSize: "2rem", color: "#007bff", fontWeight: "bold" }}>
            Edit Product
          </h1>
        </Col>

        {/* Buttons - Right */}
        <Col xs={6} className="d-flex justify-content-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/adminproducts")}
            className="me-2"
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Col>
      </Row>

      {/* Edit Product Form */}
      <Form onSubmit={handleSave} className="p-3 border rounded">
        <Form.Group className="mb-3" controlId="productName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="productDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="productPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter product price"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="productStock">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter product stock"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="productImage">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Enter image URL"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="productCategoryId">
          <Form.Label>Category ID</Form.Label>
          <Form.Control
            type="number"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            placeholder="Enter category ID"
            required
          />
        </Form.Group>

        {/* Bottom Save/Cancel Buttons */}
        <Row className="mt-4">
          <Col xs={6} className="text-start">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/adminproducts")}
            >
              Cancel
            </Button>
          </Col>
          <Col xs={6} className="text-end">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditProductForm;
