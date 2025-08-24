import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";
import { fetchSubcategoryRequest } from "../../features/subcategories/subcategoryAction";
import { fetchProductCategoryRequest } from "../../features/categories/categoriesAction";
import { createProductRequest, resetProductStatus } from "../../features/product/productActions";

const AddProductForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ensure arrays for categories and subcategories
  const categoryState = useSelector((state) => state.categoryproducts);
  const subcategoryState = useSelector((state) => state.subcategory);

  const categoryproduct = Array.isArray(categoryState?.categoryproduct)
    ? categoryState.categoryproduct
    : [];

  const subcategories = Array.isArray(subcategoryState?.subcategories)
    ? subcategoryState.subcategories
    : [];
    console.log("Category Data:", subcategories); 

  const {
    createdMessage = null,
    error = null,
    loading: isSubmitting = false,
  } = useSelector((state) => state.products || {});

  const [product, setProduct] = useState({
  name: "",
  slug: "",
  description: "",
  selling_price: "",
  mrp: "",
  stock: "",
  unit: "",
  image_url: "",
  thumbnail: [""],  // default with one input field
  weight_kg: "",
  is_active: false,
  is_featured: false,
  category_name: "",
  subcategory_name: "",
});


  useEffect(() => {
  dispatch(resetProductStatus()); // clear stale state
  dispatch(fetchProductCategoryRequest());
  dispatch(fetchSubcategoryRequest());
}, [dispatch]);


useEffect(() => {
  if (createdMessage) {
    alert(createdMessage);
    dispatch(resetProductStatus()); // optional safeguard
    navigate("/admin/adminproducts");
  }

  if (error) {
    alert(error);
    dispatch(resetProductStatus());
  }
}, [createdMessage, error, dispatch, navigate]);


  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getCategoryIdByName = (name) => {
    const category = categoryproduct.find((cat) => cat.name === name);
    return category ? category.id : null;
  };

  const getSubcategoryIdByName = (name) => {
    const subcategory = subcategories.find((sub) => sub.name === name);
    return subcategory ? subcategory.id : null;
  };
  console.log("Product State:", getSubcategoryIdByName);

  const handleThumbnailChange = (index, value) => {
  const updatedThumbnails = [...product.thumbnail];
  updatedThumbnails[index] = value;
  setProduct((prev) => ({ ...prev, thumbnail: updatedThumbnails }));
};

const addThumbnailField = () => {
  setProduct((prev) => ({ ...prev, thumbnail: [...prev.thumbnail, ""] }));
};

const removeThumbnailField = (index) => {
  const updatedThumbnails = [...product.thumbnail];
  updatedThumbnails.splice(index, 1);
  setProduct((prev) => ({ ...prev, thumbnail: updatedThumbnails }));
};


  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name,
      slug,
      selling_price,
      mrp,
      stock,
      unit,
      image_url,
      category_name,
      subcategory_name,
    } = product;

    const requiredFields = [
      name,
      slug,
      selling_price,
      mrp,
      stock,
      unit,
      image_url,
      category_name,
      subcategory_name,
    ];

    if (requiredFields.some((field) => !field)) {
      alert("Please fill in all required fields.");
      return;
    }

    const category_id = getCategoryIdByName(category_name);
    const subcategory_id = getSubcategoryIdByName(subcategory_name);

    if (!category_id || !subcategory_id) {
      alert("Invalid category or subcategory selected.");
      return;
    }

    const payload = {
  name: product.name,
  slug: product.slug,
  description: product.description,
  selling_price: product.selling_price,
  mrp: product.mrp,
  stock: product.stock,
  unit: product.unit,
  image_url: product.image_url,
  thumbnail: product.thumbnail.filter(url => url.trim() !== ""), // clean empty entries
  weight_kg: product.weight_kg,
  active: product.is_active ? 1 : 0,
  featured: product.is_featured ? 1 : 0,
  category_id,
  subcategory_id,
};

    dispatch(createProductRequest(payload));
  };

  return (
    <Container className="mt-4">
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
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
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
                value={product.slug}
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
                value={product.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Selling Price *</Form.Label>
              <Form.Control
                type="number"
                name="selling_price"
                value={product.selling_price}
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
                value={product.mrp}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category_name"
                value={product.category_name}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categoryproduct.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Subcategory *</Form.Label>
              <Form.Select
                name="subcategory_name"
                value={product.subcategory_name}
                onChange={handleChange}
                required
              >
                <option value="">Select Subcategory</option>
                {subcategories
                  .filter(
                    (sub) =>
                      sub.category_id ===
                      getCategoryIdByName(product.category_name)
                  )
                  .map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={product.stock}
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
                value={product.unit}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="text"
                name="image_url"
                value={product.image_url}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
  <Col>
    <Form.Group>
      <Form.Label>Thumbnail URLs</Form.Label>
      {product.thumbnail.map((thumb, index) => (
        <div key={index} className="d-flex mb-2">
          <Form.Control
            type="text"
            placeholder={`Thumbnail URL ${index + 1}`}
            value={thumb}
            onChange={(e) => handleThumbnailChange(index, e.target.value)}
          />
          {index > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeThumbnailField(index)}
              className="ms-2"
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline-primary" size="sm" onClick={addThumbnailField}>
        Add Thumbnail
      </Button>
    </Form.Group>
  </Col>
</Row>


        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Weight (in kg)</Form.Label>
              <Form.Control
                type="text"
                name="weight_kg"
                value={product.weight_kg}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

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
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
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
