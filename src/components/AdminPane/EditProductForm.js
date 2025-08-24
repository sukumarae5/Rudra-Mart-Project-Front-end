// EditProductForm.js

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductRequest,
  updateProductRequest,
} from "../../features/product/productActions";
import { fetchSubcategoryRequest } from "../../features/subcategories/subcategoryAction";
import { fetchProductCategoryRequest } from "../../features/categories/categoriesAction";

const EditProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedThumbnail, setSelectedThumbnail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    selling_price: "",
    mrp: "",
    category_id: "",
    subcategory_id: "",
    stock: "",
    unit: "",
    image_url: "",
    thumbnail: [], // store all possible thumbnails
    weight_kg: "",
    active: false,
    featured: false,
  });

  const { product = [], loading = false, updateMessage } = useSelector(
    (state) => state.products || {}
  );
  const categoryState = useSelector((state) => state.categoryproducts);
  const subcategoryState = useSelector((state) => state.subcategory);

  const categoryproduct = Array.isArray(categoryState?.categoryproduct)
    ? categoryState.categoryproduct
    : [];
  const subcategories = Array.isArray(subcategoryState?.subcategories)
    ? subcategoryState.subcategories
    : [];

  useEffect(() => {
    dispatch(fetchProductCategoryRequest());
    dispatch(fetchSubcategoryRequest());
    if (id) {
      dispatch(fetchProductRequest(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && id) {
      const thumbnails = Array.isArray(product.thumbnail)
        ? product.thumbnail
        : typeof product.thumbnail === "string"
        ? product.thumbnail.split(",").map((url) => url.trim())
        : [];

      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        selling_price: product.selling_price || "",
        mrp: product.mrp || "",
        category_id: product.category_id || "",
        subcategory_id: product.subcategory_id || "",
        stock: product.stock || "",
        unit: product.unit || "",
        image_url: product.image_url || "",
        weight_kg: product.weight_kg || "",
        active: Boolean(product.active),
        featured: Boolean(product.featured),
        thumbnail: thumbnails, // list of thumbnails for preview
      });

      setSelectedThumbnail(product.selectedThumbnail || thumbnails[0] || ""); // default first one
    }
  }, [product, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      const updatedPayload = {
        ...formData,
        selling_price: parseFloat(formData.selling_price) || 0,
        mrp: parseFloat(formData.mrp) || 0,
        stock: parseInt(formData.stock) || 0,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        subcategory_id: formData.subcategory_id
          ? parseInt(formData.subcategory_id)
          : null,
        unit: formData.unit || null,
        image_url: formData.image_url || null,
        thumbnail: formData.thumbnail || [], // save only one thumbnail
        active: Boolean(formData.active),
        featured: Boolean(formData.featured),
      };

      console.log("Sanitized Payload:", updatedPayload);
      dispatch(updateProductRequest({ id, data: updatedPayload }));
    }
  };

  useEffect(() => {
    if (updateMessage) {
      alert(updateMessage);
      navigate("/admin/adminproducts");
    }
  }, [updateMessage, navigate]);

  return (
    <div className="container-fluid">
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
          <h1
            className="text-start"
            style={{ fontSize: "2rem", fontWeight: "bold" }}
          >
            Edit Product
          </h1>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit} className="p-3 border rounded shadow">
        {/* --- Product Info --- */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
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

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* --- Prices --- */}
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

        {/* --- Category/Subcategory --- */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categoryproduct.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Subcategory</Form.Label>
              <Form.Select
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleChange}
              >
                <option value="">Select Subcategory</option>
                {subcategories
                  .filter(
                    (sub) =>
                      sub.category_id === parseInt(formData.category_id)
                  )
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* --- Stock & Unit --- */}
        <Row className="mb-3">
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
              <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* --- Image URL --- */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* --- Thumbnail Selection --- */}
      {/* --- Thumbnails --- */}
<Row className="mb-3">
  <Col>
    <Form.Group>
      <Form.Label>Add Thumbnail URL</Form.Label>
      <div className="d-flex gap-2">
        <Form.Control
          type="text"
          value={selectedThumbnail}
          onChange={(e) => setSelectedThumbnail(e.target.value)}
          placeholder="Paste image URL"
        />
        <Button
          variant="success"
          type="button"
          onClick={() => {
            if (selectedThumbnail.trim()) {
              setFormData((prev) => ({
                ...prev,
                thumbnail: [...prev.thumbnail, selectedThumbnail.trim()],
              }));
              setSelectedThumbnail(""); // clear input after add
            }
          }}
        >
          Add
        </Button>
      </div>
    </Form.Group>

    {formData.thumbnail.length > 0 && (
      <div className="d-flex gap-2 mt-3 flex-wrap">
        {formData.thumbnail.map((url, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <img
              src={url}
              alt={`thumb-${idx}`}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <Button
              variant="danger"
              size="sm"
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                borderRadius: "50%",
                padding: "2px 6px",
              }}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  thumbnail: prev.thumbnail.filter((_, i) => i !== idx),
                }))
              }
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    )}
  </Col>
</Row>

        {/* --- Weight --- */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Weight (in kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* --- Toggles --- */}
        <Row className="mb-3">
          <Col>
            <Form.Check
              type="switch"
              label="Active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            <Form.Check
              type="switch"
              label="Featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* --- Buttons --- */}
        <Row className="mt-4">
          <Col xs={6}>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/adminproducts")}
            >
              Cancel
            </Button>
          </Col>
          <Col xs={6} className="text-end">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Update"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditProductForm;
