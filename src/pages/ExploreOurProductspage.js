import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Container, Badge } from "react-bootstrap";
import { FaEye, FaRegHeart, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchproductsrequest,
  addToWishlist,
  setSelectedProduct,
} from "../features/product/productActions";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";
import { useNavigate } from "react-router-dom";

const ExploreOurProductspage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [], loading, error } = useSelector((state) => state.products || {});
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [clickedProducts, setClickedProducts] = useState(new Set());
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    dispatch(fetchproductsrequest());

        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [dispatch]);

    const handleAddToCart = async (event, product) => {
        event.stopPropagation();
        try {
            const userToken = localStorage.getItem("authToken");
            if (!userToken) {
                alert("Session expired. Please log in.");
                navigate("/login");
                return;
            }
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id) {
                alert("User information is missing. Please log in.");
                navigate("/login");
                return;
            }
            const isProductInCart = cartItems.some((item) => item.user_id === user.id && item.product_id === product.id);
            if (isProductInCart) {
                alert("Product is already in the cart.");
                return;
            }
            const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({ user_id: user.id, product_id: product.id, quantity: 1 }),
            });
            const data = await response.json();
            if (!response.ok) {
                alert(`Error: ${data.message || response.statusText}`);
                return;
            }
            alert("Product successfully added to cart.");
            dispatch(fetchApiCartDataRequest());
        } catch (error) {
            console.error("Error adding product to cart:", error);
            alert(`Error: ${error.message}`);
        }    };

    const handleCardClick = (product) => {
        dispatch(setSelectedProduct(product));
        navigate("/productpage");
    };
    const handleWishlistClick = (e, product) => {
        e.stopPropagation();
        setClickedProducts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(product.id)) {
                newSet.delete(product.id);
            } else {
                newSet.add(product.id);
                dispatch(addToWishlist(product));
            }
            return newSet;
        });
    };

  const displayCount = screenWidth < 768 ? 4 : viewAll ? products.length : 8;

  return (
    <div>
      <div className="d-flex align-items-center">
        <Badge bg="danger" style={{ width: "20px", height: "50px", marginLeft: "30px", marginRight: "10px" }}></Badge>
        <p style={{ color: "#DB4444", fontWeight: "bold", fontSize: "20px" }}>Our Products</p>
      </div>

      <div className="d-flex justify-content-around align-items-center">
        <h1 style={{ fontWeight: "bold", fontSize: "30px", marginRight: "auto", marginLeft: "30px" }}>
          Explore Our Products
        </h1>
        <Row className="mt-4">
          <Col md={12} className="text-center">
            <Button variant="danger" onClick={() => setViewAll((prev) => !prev)}>
              {viewAll ? "Show Less" : "View All Products"}
            </Button>
          </Col>
        </Row>
      </div>

      <Container className="mt-4">
        <Row className="justify-content-center">
          {loading ? (
            <h3>Loading products...</h3>
          ) : error ? (
            <h3>Error fetching products: {error}</h3>
          ) : (
            products.slice(0, displayCount).map((product) => (
              <Col key={product.id} xs={6} sm={6} md={3} className="mb-4">
                <ProductCard
                  product={product}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  handleCardClick={handleCardClick}
                  handleWishlistClick={handleWishlistClick}
                  clickedProducts={clickedProducts}
                  handleAddToCart={handleAddToCart}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

const ProductCard = ({
  product,
  hoveredCard,
  setHoveredCard,
  handleCardClick,
  handleWishlistClick,
  clickedProducts,
  handleAddToCart,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Card
      className="border-0 bg-light-pink"
      style={{
        height: "100%",
        minHeight: "400px",
        maxHeight: "420px",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        position: "relative",
      }}
      onMouseEnter={() => setHoveredCard(product.id)}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={() => handleCardClick(product)}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 2,
        }}
      >
        {clickedProducts.has(product.id) ? (
          <FaHeart
            style={{ fontSize: "1.5rem", color: "red", cursor: "pointer" }}
            onClick={(e) => handleWishlistClick(e, product)}
          />
        ) : (
          <FaRegHeart
            style={{ fontSize: "1.5rem", color: "#575B5A", cursor: "pointer" }}
            onClick={(e) => handleWishlistClick(e, product)}
          />
        )}
        <FaEye
          style={{ fontSize: "1.5rem", color: "gray", cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick(product);
          }}
        />
      </div>

      {/* Image Box */}
      <div
  style={{
    width: "100%",
    height: "400px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    margin: "0 auto", // Center the container horizontally
  }}
>
  <Card.Img
    variant="top"
    src={product.image_url}
    style={{
      height: "100%",
      width: "100%",
      objectFit: "cover",
      transition: "transform 0.3s",
    }}
  />
</div>


      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title className="text-center">{product.name}</Card.Title>
        <Card.Text className="text-center">Price: ₹{product.price}</Card.Text>
        <Card.Text className="text-center">Description :{product.description}</Card.Text>

        <Button
          variant="danger"
          style={{
            width: "100%",
            fontWeight: "bold",
            opacity: hoveredCard === product.id || isClicked ? "1" : "0",
            transition: "opacity 0.3s",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsClicked(true);
            handleAddToCart(e, product);
          }}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ExploreOurProductspage;
