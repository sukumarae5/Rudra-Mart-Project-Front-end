import React, { useEffect } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchproductsrequest,
  setSelectedProduct,
} from "../features/product/productActions";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";
import { useNavigate } from "react-router-dom";

const ExploreOurProductspage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [], loading, error } = useSelector(
    (state) => state.products || {}
  );

  useEffect(() => {
    dispatch(fetchproductsrequest());
  }, [dispatch]);

  const handleCardClick = (product) => {
    dispatch(setSelectedProduct(product));
    navigate("/productpage");
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    const userToken = localStorage.getItem("authToken");

    if (!userToken) {
      alert("Please log in");
      navigate("/login");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
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
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <Container fluid style={{ marginTop: "30px", marginBottom: "30px" }}>
      <h2
        style={{
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#0033A0",
          fontSize: "30px",
        }}
      >
        All Products
      </h2>
      <p style={{ marginBottom: "25px", color: "#6c757d" }}>
        Browse our entire collection. Scroll down to see more!
      </p>
      <Row>
        {loading ? (
          <h3>Loading...</h3>
        ) : error ? (
          <h3>Error: {error}</h3>
        ) : (
          products.map((product) => {
            const hasDiscount =
              product.mrp &&
              product.selling_price &&
              product.mrp > product.selling_price;

            const discountPercent = hasDiscount
              ? Math.round(
                  ((product.mrp - product.selling_price) / product.mrp) * 100
                )
              : 0;

            return (
              <Col
                key={product.id}
                xs={12}
                sm={6}
                md={4}
                lg={2}
                style={{ marginBottom: "20px" }}
              >
                <Card
                  onClick={() => handleCardClick(product)}
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "100%",
                    }}
                  >
                    {/* Discount Badge */}
                    <div
                      className="position-absolute top-0 start-0 text-dark rounded"
                      style={{
                        backgroundColor: "#ffc107",
                        fontSize: "10px",
                        padding: "2px 5px",
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    >
                      {discountPercent}% OFF
                    </div>

                    {/* Delivery Time */}
                    {product.delivery_time && (
                      <div className="position-absolute bottom-0 start-0 bg-primary text-white px-2 py-1 rounded">
                        ⏱ {product.delivery_time}
                      </div>
                    )}

                    {/* Product Image */}
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
                  </div>

                  <Card.Body className="text-center d-flex flex-column justify-content-between">
                    <Card.Title className="text-truncate">
                      {product.name}
                    </Card.Title>
                    <Card.Text>{product.weight_kg || product.quantity}</Card.Text>
                    <Card.Text>
                      <strong>₹{product.selling_price}</strong>{" "}
                      {product.mrp && (
                        <span className="text-muted text-decoration-line-through ms-1">
                          ₹{product.mrp}
                        </span>
                      )}
                    </Card.Text>
                    <Button
                      onClick={(e) => handleAddToCart(e, product)}
                      variant="primary"
                      className="w-100"
                    >
                      Add
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
};

export default ExploreOurProductspage;
