import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";

const AddProductForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !product.name ||
      !product.price ||
      !product.stock ||
      !product.category_id ||
      !product.image_url
    ) {
      setLoading(false);
      alert("All fields are required");
      return;
    }

    if (isNaN(product.price) || Number(product.price) <= 0) {
      setLoading(false);
      alert("Price must be a valid number greater than zero");
      return;
    }

    if (!Number.isInteger(Number(product.stock)) || Number(product.stock) < 0) {
      setLoading(false);
      alert("Stock must be a positive integer");
      return;
    }

    try {
      const newProduct = {
        id: Date.now(),
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        image_url: product.image_url,
        created_at: new Date().toISOString(),
      };

      console.log("Product data being sent to API:", newProduct);

      const response = await fetch(
        "http://192.168.1.6:3000/api/products/productregister",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );

      setLoading(false);

      const data = await response.json();

      if (!response.ok) {
        console.log("Error response:", data);
        setError(data.message || "Failed to add product");
        alert(`Error: ${data.message || "Failed to add product"}`);
        return;
      }

      alert(`Success: ${data.message || "Product added successfully"}`);
      navigate("/admin/adminproducts");
    } catch (error) {
      setLoading(false);
      console.error("Error during product addition:", error);
      setError(
        error.message || "Failed to add product, please try again later"
      );
      alert(
        `Error: ${
          error.message || "Failed to add product, please try again later"
        }`
      );
    }
  };

  return (
    <Container className="mt-4">
      {/* Top Section: Back Button, Header & Save/Cancel Buttons */}
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
          <Col xs={12} md={6} className="text-md-start text-center">
            <h1
              style={{ fontSize: "2rem", color: "#007bff", fontWeight: "bold" }}
            >
              Add Product
            </h1>
          </Col>
        </Col>
        <Col xs={6} className="text-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/adminproducts")}
            className="me-2"
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Save"}
          </Button>
        </Col>
      </Row>

      {/* Form Section */}
      <Card className="shadow p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={3}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price:</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter product price"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock:</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="Enter product stock"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category ID:</Form.Label>
            <Form.Control
              type="number"
              name="category_id"
              value={product.category_id}
              onChange={handleChange}
              placeholder="Enter category ID"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL:</Form.Label>
            <Form.Control
              type="text"
              name="image_url"
              value={product.image_url}
              onChange={handleChange}
              placeholder="Enter image URL"
              required
            />
          </Form.Group>
        </Form>
      </Card>

      {/* Bottom Section: Save/Cancel Buttons */}
      <Row className="mt-4">
        <Col className="text-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/adminproducts")}
            className="me-2"
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Save"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProductForm;
