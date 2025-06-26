import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";

const AddProductForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    mrp: "",
    category_id: "",
    stock: "",
    unit: "",
    image_url: "",
    weight: "",
    is_active: false,
    is_featured: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !product.name ||
      !product.slug ||
      !product.price ||
      !product.mrp ||
      !product.category_id ||
      !product.stock ||
      !product.unit ||
      !product.image_url
    ) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/products/productregister`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error adding product");
      } else {
        alert(data.message || "Product added successfully");
        navigate("/admin/adminproducts");
      }
    } catch (error) {
      alert(error.message || "Error adding product, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      {/* Header Section */}
      <Row className="align-items-center mb-3">
        <Col xs={6}>
          <Button
            variant="link"
            onClick={() => navigate("/admin/adminproducts")}
            className="text-primary d-flex align-items-center"
            style={{ fontSize: "1.2rem", gap: "5px" }}
          >
            <IoArrowBack size={24} />
            <span>Back</span>
          </Button>
        </Col>
      </Row>

      <Row className="align-items-center mb-3">
        <Col xs={6}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Add Product</h1>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit} className="p-3 border rounded shadow">
        {/* Product Name & Slug */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
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
                value={product.slug}
                onChange={handleChange}
                placeholder="Enter product slug"
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
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description"
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
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter selling price"
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
                value={product.mrp}
                onChange={handleChange}
                placeholder="Enter MRP"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Category, Stock, Unit */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Category ID *</Form.Label>
              <Form.Control
                type="text"
                name="category_id"
                value={product.category_id}
                onChange={handleChange}
                placeholder="Enter category ID"
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
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
                value={product.unit}
                onChange={handleChange}
                placeholder="Enter unit (e.g., pcs, kg)"
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
                name="image_url"
                value={product.image_url}
                onChange={handleChange}
                placeholder="Enter image URL"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Weight (in kg) */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Weight (in kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="weight"
                value={product.weight}
                onChange={handleChange}
                placeholder="Enter weight in kg"
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
              checked={product.is_active}
              onChange={handleChange}
            />
            <Form.Check
              type="switch"
              id="featured-switch"
              label="Featured"
              name="is_featured"
              checked={product.is_featured}
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
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Adding...
                </>
              ) : (
                "Save Product"
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddProductForm;
