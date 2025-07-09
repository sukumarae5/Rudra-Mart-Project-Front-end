import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

import { fetchProductRequest, updateProductRequest } from "../../features/product/productActions";
import { fetchSubcategoryRequest } from "../../features/subcategories/subcategoryAction";
import { fetchProductCategoryRequest } from "../../features/categories/categoriesAction";

const EditProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

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
    weight_kg: "",
    active: false,
    featured: false,
  });

const {
  product = null,
  loading = false,
  error = null,
  updateMessage = ""
} = useSelector((state) => state.products|| {});

  const categoryState = useSelector((state) => state.categoryproducts);
  const subcategoryState = useSelector((state) => state.subcategory);

  const categoryproduct = Array.isArray(categoryState?.categoryproduct) ? categoryState.categoryproduct : [];
  const subcategories = Array.isArray(subcategoryState?.subcategories) ? subcategoryState.subcategories : [];
  console.log(product)
  console.log(updateMessage)
  useEffect(() => {
    dispatch(fetchProductCategoryRequest());
    dispatch(fetchSubcategoryRequest());
    if (id) {
      dispatch(fetchProductRequest(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && id) {
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
      });
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
      dispatch(updateProductRequest(id, formData));
    }
    if (updateMessage) {
      alert(updateMessage)
      navigate("/admin/adminproducts");
    }
  };

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
          <h1 className="text-start" style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Edit Product
          </h1>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit} className="p-3 border rounded shadow">
        {/* Form Fields */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Product Name *</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Slug *</Form.Label>
              <Form.Control type="text" name="slug" value={formData.slug} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Description *</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Selling Price *</Form.Label>
              <Form.Control type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>MRP *</Form.Label>
              <Form.Control type="number" name="mrp" value={formData.mrp} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Category *</Form.Label>
              <Form.Select name="category_id" value={formData.category_id} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categoryproduct.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Subcategory *</Form.Label>
              <Form.Select name="subcategory_id" value={formData.subcategory_id} onChange={handleChange} required>
                <option value="">Select Subcategory</option>
                {subcategories.filter((sub) => sub.category_id === parseInt(formData.category_id)).map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Stock *</Form.Label>
              <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Unit *</Form.Label>
              <Form.Control type="text" name="unit" value={formData.unit} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Image URL *</Form.Label>
              <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Weight (in kg)</Form.Label>
              <Form.Control type="number" step="0.01" name="weight_kg" value={formData.weight_kg} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Check type="switch" label="Active" name="active" checked={formData.active} onChange={handleChange} />
            <Form.Check type="switch" label="Featured" name="featured" checked={formData.featured} onChange={handleChange} />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs={6}>
            <Button variant="secondary" onClick={() => navigate("/admin/adminproducts")}>
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
