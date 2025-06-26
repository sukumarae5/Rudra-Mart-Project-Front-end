import React, { useEffect } from "react";
import {
  Card,
  Spinner,
  Row,
  Col,
  Button,
  Container,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchproductsrequest } from "../features/product/productActions";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";

const Subcategoryproductspage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    categoryId,
    categoryName,
    selectedSubcategoryId,
    selectedSubcategoryName,
    showAllProducts,
    subcategories = []
  } = location.state || {};
  const { products = [] } = useSelector((state) => state.products || {});

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchproductsrequest());
    }
  }, [products, dispatch]);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    const userToken = localStorage.getItem("authToken");
    if (!userToken) {
      alert("Please log in");
      navigate("/login");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/cart/add`, {
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
    });
    if (res.ok) {
      dispatch(fetchApiCartDataRequest());
      alert("Added to cart");
    }
  };
  
  if (!categoryId) {
    return <div className="text-center py-5">Invalid Category</div>;
  }

  if (!products.length) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const ProductCard = ({ product }) => {
    const hasDiscount = product.mrp > product.selling_price;
    const discountPercent = hasDiscount
      ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
      : 0;

    return (
      <Col key={product.id}>
        <Card
          className="border-0 shadow-sm h-100"
          style={{
            borderRadius: "6px",
            position: "relative",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.classList.add("shadow");
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.classList.remove("shadow");
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              position: "relative",
              paddingTop: "100%",
              overflow: "hidden",
              borderRadius: "6px",
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
            {hasDiscount && (
              <div
                style={{
                  position: "absolute",
                  top: "5px",
                  left: "5px",
                  backgroundColor: "#d32f2f",
                  fontSize: "10px",
                  padding: "2px 5px",
                  fontWeight: "bold",
                  color: "#fff",
                  borderRadius: "3px",
                  zIndex: 2,
                }}
              >
                {discountPercent}% OFF
              </div>
            )}
            {product.delivery_time && (
              <div
                style={{
                  position: "absolute",
                  bottom: "5px",
                  left: "5px",
                  backgroundColor: "#007bff",
                  fontSize: "9px",
                  padding: "1px 4px",
                  color: "#fff",
                  borderRadius: "3px",
                  zIndex: 2,
                }}
              >
                ⏱ {product.delivery_time}
              </div>
            )}
            <Button
              onClick={(e) => handleAddToCart(e, product)}
              variant="primary"
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "4px 12px",
                borderRadius: "12px",
              }}
            >
              Add
            </Button>
          </div>
          <Card.Body className="p-2">
            <div style={{ fontSize: "14px", fontWeight: "bold", textAlign: "left" }}>
              {product.name}
            </div>
            <div style={{ fontSize: "13px", color: "#555", textAlign: "left" }}>
              {product.weight_kg || product.quantity}
            </div>
            <div style={{ textAlign: "left", marginTop: "3px" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                ₹{product.selling_price}
              </span>
              {product.mrp && (
                <span
                  style={{
                    fontSize: "12px",
                    textDecoration: "line-through",
                    color: "#777",
                    marginLeft: "5px",
                  }}
                >
                  ₹{product.mrp}
                </span>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };
  
  // Final Products Logic
  const filteredProducts = showAllProducts
    ? products.filter((product) =>
        subcategories.some(
          (sub) => String(sub.id) === String(product.subcategory_id)
        )
      )
    : products.filter(
        (product) =>
          String(product.subcategory_id) === String(selectedSubcategoryId)
      );

  return (
    <Container fluid className="p-4">
      <h2 className="fw-bold mb-4 text-capitalize">
        {showAllProducts
          ? `${categoryName} Products`
          : selectedSubcategoryName}
      </h2>
      <Row xs={1} sm={2} md={3} lg={5} className="g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center w-100 py-5 text-muted">
            No products available.
          </div>
        )}
      </Row>
    </Container>
  );
};

export default Subcategoryproductspage;

