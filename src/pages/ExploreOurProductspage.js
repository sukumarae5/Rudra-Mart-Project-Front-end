import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Container, Badge } from "react-bootstrap";
import { FaEye } from "react-icons/fa"; // Eye icon
import { useDispatch, useSelector } from "react-redux";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addToWishlist, fetchproductsrequest, REMOVE_FROM_WISHLIST, setSelectedProduct } from "../features/product/productActions";
import { removeWishlistProductRequest } from "../features/wishlist/wishlistAction";

const ExploreOurProductspage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [], loading, error } = useSelector((state) => state.products || {});
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { wishlistItems = [] } = useSelector((state) => state.wishlist || {}); // Wishlist from Redux
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Snackbar state for feedback
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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
      const isProductInCart = cartItems.some(
        (item) => item.user_id === user.id && item.product_id === product.id
      );
      if (isProductInCart) {
        setSnackbarMessage("Product is already in the cart.");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
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
        setSnackbarMessage(`Error: ${data.message || response.statusText}`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
      setSnackbarMessage("Product successfully added to cart.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      dispatch(fetchApiCartDataRequest());
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCardClick = (product) => {
    dispatch(setSelectedProduct(product));
    navigate("/productpage");
  };

  // Handle Wishlist Click (Add/Remove Product)
  const handleWishlistClick = (e, product) => {
    e.stopPropagation();

    if (wishlistItems.some((item) => item.id === product.id)) {
      // Product is in wishlist, remove it
       dispatch(removeWishlistProductRequest(wishlistItems.wishlist_id)); // Dispatch remove action
      setSnackbarMessage("Removed from wishlist.");
      setSnackbarSeverity("info");
    } else {
      // Product is not in wishlist, add it
      dispatch(addToWishlist(product)); // Dispatch add action
      setSnackbarMessage("Added to wishlist.");
      setSnackbarSeverity("success");
    }

    setOpenSnackbar(true); // Open Snackbar for feedback
  };

  const displayCount = screenWidth < 768 ? 4 : viewAll ? products.length : 8;

  return (
    <div>
      <div className="d-flex align-items-center">
        <Badge
          bg="danger"
          style={{ width: "20px", height: "50px", marginLeft: "30px", marginRight: "10px" }}
        />
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
                  wishlistItems={wishlistItems} // Pass wishlist items for tracking
                  handleAddToCart={handleAddToCart}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

const ProductCard = ({
  product,
  hoveredCard,
  setHoveredCard,
  handleCardClick,
  handleWishlistClick,
  wishlistItems,
  handleAddToCart,
}) => {
  const isProductInWishlist = wishlistItems.some((item) => item.id === product.id);

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
        {isProductInWishlist ? (
          <FavoriteIcon
            style={{ fontSize: "1.8rem", color: "#DB4444", cursor: "pointer" }}
            onClick={(e) => handleWishlistClick(e, product)}
          />
        ) : (
          <FavoriteBorderIcon
            style={{ fontSize: "1.8rem", color: "#575B5A", cursor: "pointer" }}
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

      <div
        style={{
          width: "100%",
          height: "400px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
          margin: "0 auto",
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
        <Button
          variant="danger"
          style={{
            width: "100%",
            fontWeight: "bold",
            opacity: hoveredCard === product.id ? "1" : "0",
            transition: "opacity 0.3s",
          }}
          onClick={(e) => {
            e.stopPropagation();
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
