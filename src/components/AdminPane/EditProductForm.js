import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";

const EditProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product; // Get selected product from navigation state

  // Ensure product details exist
  useEffect(() => {
    if (!product) {
      alert("No product selected! Redirecting...");
      navigate("/admin/adminproducts");
    }
  }, [product, navigate]);

  // Initialize state with existing product data
  const [formData, setFormData] = useState({
    product_name: product?.product_name || "",
    product_description: product?.product_description || "",
    product_price: product?.product_price || "",
    stock: product?.stock || "",
    product_image: product?.product_image || "",
    category_id: product?.category_id || "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSave = async (event) => {
    event.preventDefault();
    
    if (!product || !product.product_id) {
      alert("Invalid product data.");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.12:8081/api/products/updateproduct/${product.product_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Product updated successfully!");
        navigate("/admin/adminproducts");
      } else {
        alert(`Error: ${data.error || "Failed to update product"}`);
      }
    } catch (error) {
      alert("Error updating product:", error.message);
    }
  };

  return (
    <div className="container-fluid">
      {/* Header with Back Button */}
      <Row className="align-items-center mb-3">
        <Col xs={6}>
          <Button
            variant="link"
            onClick={() => navigate("/admin/adminproducts")}
            className="text-primary d-flex align-items-center"
            style={{ fontSize: "1.2rem", gap: "8px" }}
          >
            <IoArrowBack size={24} />
            <span>Back</span>
          </Button>
        </Col>
      </Row>

      {/* Title and Buttons */}
      <Row className="align-items-center mb-3">
        <Col xs={6}>
          <h1 className="text-start" style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Edit Product
          </h1>
        </Col>
        <Col xs={6} className="d-flex justify-content-end">
          <Button variant="secondary" onClick={() => navigate("/admin/adminproducts")} className="me-2">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Col>
      </Row>

      {/* Product Edit Form */}
      <Form onSubmit={handleSave} className="p-3 border rounded shadow">
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="product_description"
            value={formData.product_description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price (Rs)</Form.Label>
          <Form.Control
            type="number"
            name="product_price"
            value={formData.product_price}
            onChange={handleChange}
            placeholder="Enter product price"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter stock quantity"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="product_image"
            value={formData.product_image}
            onChange={handleChange}
            placeholder="Enter image URL"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
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

        {/* Save & Cancel Buttons */}
        <Row className="mt-4">
          <Col xs={6}>
            <Button variant="secondary" onClick={() => navigate("/admin/adminproducts")}>
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