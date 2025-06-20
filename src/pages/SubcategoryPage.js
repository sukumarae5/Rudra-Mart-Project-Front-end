import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Spinner, Row, Col, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubcategoryRequest } from "../features/subcategories/subcategoryAction";
import { fetchproductsrequest } from "../features/product/productActions";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";

const SubcategoryPage = () => {
  const location = useLocation();
  const { categoryId, categoryName } = location.state || {};

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subcategories = [], loading = false, error = null } = useSelector((state) => state.subcategory || {});
  const { products = [] } = useSelector((state) => state.products || {});

  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  useEffect(() => {
    dispatch(fetchSubcategoryRequest());
  }, [dispatch]);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchproductsrequest());
    }
  }, [products, dispatch]);

  useEffect(() => {
    if (categoryId && subcategories.length > 0) {
      const filtered = subcategories.filter(
        (sub) => String(sub.category_id) === String(categoryId)
      );
      setFilteredSubcategories(filtered);
    }
  }, [categoryId, subcategories]);

  const filteredProducts = products.filter(
    (product) => String(product.subcategory_id) === String(selectedSubcategoryId)
  );

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    const userToken = localStorage.getItem("authToken");
    if (!userToken) {
      alert("Please log in");
      navigate("/login");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/cart/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        }),
      }
    );

    if (res.ok) {
      dispatch(fetchApiCartDataRequest());
      alert("Added to cart");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center py-5">Error: {error}</div>;
  }

  return (
    <Container fluid className="p-4">
      <h2 className="fw-bold mb-5 text-capitalize">{categoryName} Subcategories</h2>
      <Row xs={1} md={3} lg={6} className="g-4">
        {filteredSubcategories.map((sub) => (
          <Col key={sub.id}>
            <Card
              className={`shadow-sm border-0 h-100 ${selectedSubcategoryId === sub.id ? 'border-success border-2' : ''}`}
              onClick={() => setSelectedSubcategoryId(sub.id)}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src={sub.image_url}
                alt={sub.name}
                style={{
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <Card.Body>
                <Card.Title className="text-center">{sub.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedSubcategoryId && (
        <div className="mt-5">
          <h3 className="fw-bold mb-4 text-capitalize">Products</h3>
          <Row xs={1} sm={2} md={3} lg={5} className="g-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const hasDiscount = product.mrp > product.selling_price;
                const discountPercent = hasDiscount
                  ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
                  : 0;

                return (
                  <Col key={product.id}>
                    <Card className="border-0 shadow-sm h-100">
                      <div style={{ position: "relative", width: "100%", paddingBottom: "100%" }}>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{
                            position: "absolute",
                            top: "8%",
                            left: "8%",
                            width: "84%",
                            height: "84%",
                            objectFit: "contain",
                            borderRadius: "10px",
                          }}
                        />
                        <div
                          className="position-absolute top-0 start-0 text-dark rounded"
                          style={{
                            backgroundColor: "#ffc107",
                            fontSize: "10px",
                            padding: "2px 6px",
                            fontWeight: "bold",
                            zIndex: 2,
                          }}
                        >
                          {discountPercent}% OFF
                        </div>
                        {product.delivery_time && (
                          <div className="position-absolute bottom-0 start-0 bg-primary text-white px-2 py-1 rounded" style={{ fontSize: "10px" }}>
                            ⏱ {product.delivery_time}
                          </div>
                        )}
                      </div>

                      <Card.Body className="text-center d-flex flex-column justify-content-between">
                        <Card.Title className="text-truncate" style={{ fontSize: "14px" }}>
                          {product.name}
                        </Card.Title>
                        <Card.Text className="text-muted" style={{ fontSize: "13px" }}>
                          {product.weight_kg || product.quantity}
                        </Card.Text>
                        <Card.Text>
                          <strong>₹{product.selling_price}</strong>{" "}
                          {product.mrp && (
                            <span className="text-muted text-decoration-line-through ms-1" style={{ fontSize: "13px" }}>
                              ₹{product.mrp}
                            </span>
                          )}
                        </Card.Text>
                        <Button
                          onClick={(e) => handleAddToCart(e, product)}
                          variant="primary"
                          className="w-100"
                          style={{ fontSize: "13px", borderRadius: "6px" }}
                        >
                          Add
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <div className="text-center w-100 py-5 text-muted">
                No products available for this subcategory.
              </div>
            )}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default SubcategoryPage;
