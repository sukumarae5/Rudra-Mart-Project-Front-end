import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";

const AddProductForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_name: "",
    slug: "",
    product_description: "",
    selling_price: "",
    mrp: "",
    category_id: "",
    stock: "",
    unit: "",
    product_image: "",
    weight: "",
    is_active: false,
    is_featured: false,
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save new product
  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/products/addproduct`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        navigate("/admin/adminproducts");
      } else {
        alert(data.error || "Error adding product");
      }
    } catch (error) {
      alert("Error adding product: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid">
      {/* Header */}
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

      <Row className="align-items-center mb-3">
        <Col xs={6}>
          <h1 className="text-start" style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Add Product
          </h1>
        </Col>
      </Row>

      <Form onSubmit={handleSave} className="p-3 border rounded shadow">
        {/* Product Name & Slug */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
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

        {/* Description */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                name="product_description"
                value={formData.product_description}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Selling Price & MRP */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Selling Price *</Form.Label>
              <Form.Control
                type="number"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>MRP *</Form.Label>
              <Form.Control
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Category, Stock, Unit */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Category *</Form.Label>
              <Form.Control
                as="select"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="1">Dairy & Breakfast</option>
                <option value="2">Fruits</option>
                <option value="3">Vegetables</option>
                {/* Add more as needed */}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Unit *</Form.Label>
              <Form.Control
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Image URL */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="text"
                name="product_image"
                value={formData.product_image}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Weight */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Weight (in kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Active & Featured Switches */}
        <Row className="mb-3">
          <Col>
            <Form.Check
              type="switch"
              id="active-switch"
              label="Active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <Form.Check
              type="switch"
              id="featured-switch"
              label="Featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* Buttons */}
        <Row className="mt-4">
          <Col xs={6}>
            <Button variant="secondary" onClick={() => navigate("/admin/adminproducts")}>
              Cancel
            </Button>
          </Col>
          <Col xs={6} className="text-end">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddProductForm;
