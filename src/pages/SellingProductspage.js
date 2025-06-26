import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchproductsrequest,
  setSelectedProduct,
} from "../features/product/productActions";
import { addToCartRequest, fetchApiCartDataRequest } from "../features/cart/cartActions";
import { useNavigate } from "react-router-dom";

const SellingProductspage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products = [], loading, error } = useSelector(
    (state) => state.products || {}
  );
    const { cartItems = [] } = useSelector((state) => state.cart || {}); 
  

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchproductsrequest());
        dispatch(fetchApiCartDataRequest());
    
  }, [dispatch]);

  const handleCardClick = (product) => {
    dispatch(setSelectedProduct(product));
    navigate("/productpage");
  };

  
const handleAddToCart = (e, product) => {
  e.stopPropagation();
  const userToken = localStorage.getItem("authToken");
  if (!userToken) {
    alert("Please log in");
    navigate("/login");
    return;
  }
  const user = JSON.parse(localStorage.getItem("user"));

   const isProductInCart = cartItems.some(
      (item) => item.user_id === user.id && item.product_id === product.id
    );

    if (isProductInCart) {
      alert("Product already in cart");
      return;
    }
  dispatch(addToCartRequest(user.id, product.id, 1));
};

  return (
    <Container fluid style={{ marginTop: "30px", marginBottom: "30px" }}>
      {/* Header and Toggle Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: "bold",
              color: "rgb(6, 6, 6)",
              fontSize: "30px",
              margin: 0,
            }}
          >
            Featured Products
          </h2>
        </div>
        {products.length > 4 && (
          <Button
            onClick={() => setShowAll((prev) => !prev)}
            variant="outline-primary"
            style={{ fontWeight: "bold", padding: "10px 20px", whiteSpace: "nowrap" }}
          >
            {showAll ? "Show Less" : "View All"}
          </Button>
        )}
      </div>

      {/* Product Grid */}
      <Row>
        {loading ? (
          <h3>Loading...</h3>
        ) : error ? (
          <h3>Error: {error}</h3>
        ) : (
          (showAll ? products : products.slice(0, 6)).map((product) => (
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
                className="h-100 shadow-sm"
                style={{
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%", // square aspect ratio
                    overflow: "hidden",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    backgroundColor: "#fff",
                  }}
                >
                  {product.mrp && product.selling_price && product.mrp > product.selling_price ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "#ffc107",
                        color: "#000",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        padding: "5px 8px",
                        borderRadius: "4px",
                        zIndex: 2,
                      }}
                    >
                      {Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)}% OFF
                    </div>
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        width: "25px",
                        height: "25px",
                        borderRadius: "20%",
                        backgroundColor: "#f6c90e",
                        color: "#000",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        textAlign: "center",
                        lineHeight: "25px",
                        zIndex: 2,
                      }}
                    >
                      0%
                    </div>
                  )}


                  {product.delivery_time && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "110px",
                        left: "10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        fontSize: "12px",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        zIndex: 2,
                      }}
                    >
                      ⏱ {product.delivery_time}
                    </div>
                  )}

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

                {/* Card Body */}
                <Card.Body
                  className="d-flex flex-column justify-content-between text-center"
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "15px",
                  }}
                >
                  <Card.Title
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      minHeight: "40px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={product.name} // tooltip on hover
                  >
                    {product.name}
                  </Card.Title>

                  <Card.Text
                    className="text-muted"
                    style={{ fontSize: "14px", marginBottom: "5px" }}
                  >
                    {product.weight || product.quantity}
                  </Card.Text>

                  <div
                    className="d-flex justify-content-center align-items-center gap-2"
                    style={{ fontSize: "16px", fontWeight: "700" }}
                  >
                    <span>SP: ₹{product.selling_price}</span>
                    {product.mrp && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#6c757d",
                          fontSize: "14px",
                        }}
                      >
                        MRP: ₹{product.mrp}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    variant="primary"
                    className="mt-3 fw-bold"
                    style={{
                      borderRadius: "6px",
                    }}
                  >
                    Add
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default SellingProductspage;
