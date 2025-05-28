import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Badge, Carousel, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCategory from "../features/product/productCategory";
import {
  fetchproductsrequest,
  setSelectedProduct,
} from "../features/product/productActions";
import image1 from "../assets/images/image12.jpg";
import image2 from "../assets/images/image16.png";
import image3 from "../assets/images/image18.png";
import image4 from "../assets/images/image17.png";
import image5 from "../assets/images/image19.png";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";
import { addToWishlist } from "../features/product/productActions";
import { FaEye } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import SellingProductspage from "./SellingProductspage";
import Categories from "./Categories";
import ExploreOurProductspage from "./ExploreOurProductspage";
import NewArrivalpage from "./NewArrivalpage";
import {
  addToWishlistRequest,
  removeWishlistProductRequest,
} from "../features/wishlist/wishlistAction";
import ProductPagenation from "./ProductPagenation";
// Material UI imports
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Grid,   Button } from '@mui/material';

const renderStars = (rating, onClick, productId) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= rating ? "gold" : "gray",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
        onClick={() => onClick(i, productId)}
      >
        ★
      </span>
    );
  }
  return stars;
};

const HomePage = () => {
  const {
    products = [],
    error = null,
    loading = false,
  } = useSelector((state) => state.products || {});
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
  const wishlistItems = Array.isArray(wishlistData[0])
    ? wishlistData[0]
    : wishlistData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [viewAll, setViewAll] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [cartItem, setCartItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [clickedProducts, setClickedProducts] = useState(new Set()); // Initialize clickedProducts state
   // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
    const showSnackbar = (message, severity = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    };
  

  useEffect(() => {
    dispatch(fetchproductsrequest());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeUnits = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, secs };
  };

  const { days, hours, minutes, secs } = calculateTimeUnits(timeLeft);

  const scrollProducts = (direction) => {
    const container = document.getElementById("product-scroll-container");
    const scrollAmount = 300;
    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  const handleAddToCart = async (event, product) => {
    event.stopPropagation();

    try {
      const userToken = localStorage.getItem("authToken");
      
      const userData = localStorage.getItem("user");
      if (!userData) {
        showSnackbar("User not found. Please log in.", "error");
        return;
      }
      
      const user = JSON.parse(userData);
      
      

     

      if (!user?.id || !product?.id) {
        showSnackbar("Invalid user or product data", "error");
        return;
      }

      const isProductInCart = cartItems.some(
        (item) => item.user_id === user.id && item.product_id === product.id
      );
      if (isProductInCart) {
        showSnackbar("Product already in cart", "warning");
        return;
      }

      const cartItem = {
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      };

      // API call to add product to cart
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(cartItem),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showSnackbar(`Error: ${data.message || response.statusText}`, "error");
        return;
      }

      showSnackbar("Product added to cart!", "success");
      dispatch(fetchApiCartDataRequest());
    } catch (error) {
      console.error("Error adding product to cart:", error);
      showSnackbar(`Error: ${error.message}`, "error");
    }
  };

  const handleRating = (rating, productId) => {
    setRatings((prevRatings) => ({ ...prevRatings, [productId]: rating }));
  };

  const handleCardClick = (productId, product) => {
    console.log(product);
    dispatch(setSelectedProduct(product));
    navigate("/productpage");
  };

  const handleWishlistClick = (e, product) => {
    e.stopPropagation(); // Prevent card click navigation

    const userData = localStorage.getItem("user");
    if (!userData) {
      console.error("User not found in localStorage");
      return;
    }

    const user = JSON.parse(userData);
    if (!user?.id || !product?.id) {
      console.error("Invalid user or product data");
      return;
    }
    console.log(product.id);
    dispatch(addToWishlistRequest(product.id));
  };
  const removeItem = (event, productid) => {
    event.stopPropagation(); // Prevents event bubbling if needed
    console.log("Received Product ID:", productid);

    if (!productid) {
      console.error("Error: Product ID is undefined or null.");
      return;
    }

    const wishlistItem = wishlistItems.find(
      (item) => Number(item.product_id) === Number(productid)
    );
    console.log(wishlistItem);
     if (wishlistItem) {
        dispatch(removeWishlistProductRequest(wishlistItems.wishlist_id));
        showSnackbar("Removed from wishlist", "info");
      } else {
        showSnackbar("Product not found in wishlist", "warning");
      }
  };
  return (
    <div>
      <Container fluid className="mt-4 mb-4">
        <Row>
          <Col md={3} className="bg-gray-100 p-12">
            <ul className="list-none space-y-2">
              {[
                { label: "Women's Fashion", path: "/womens-fashion" },
                { label: "Men's Fashion", path: "/mens-fashion" },
                { label: "Electronics", path: "/electronics" },
                { label: "Home & Lifestyle", path: "/home-lifestyle" },
                { label: "Medicine", path: "/medicine" },
                { label: "Sports & Outdoor", path: "/sports-outdoor" },
                { label: "Baby & Toys", path: "/baby-toys" },
                { label: "Groceries & Pets", path: "/groceries-pets" },
                { label: "Health & Beauty", path: "/health-beauty" },
              ].map((category, index) => (
                <li key={index}>
                  <Link
                    to={category.path}
                    className="text-dark hover:underline"
                  >
                    {category.label} <ArrowRight />
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={9} className="pr-15">
            <Carousel>
              {[image1, image2, image3, image4, image5].map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100 object-cover h-344"
                    src={image}
                    alt={`Slide ${index + 1}`}
                  />
                  <Carousel.Caption>
                    <a
                      href="#"
                      className="absolute top-0 left-0 m-2 underline-offset-1"
                    >
                      Shop Now <ArrowRight />
                    </a>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
        <ProductPagenation/>
        <Container fluid className="mt-4">
          <div className="d-flex align-items-center">
            <Badge
              bg="danger"
              style={{
                width: "20px",
                height: "50px",
                marginLeft: "20px",
                marginRight: "10px",
              }}
            >
              {" "}
            </Badge>
            
            <p
              style={{ color: "#DB4444", fontWeight: "bold", fontSize: "20px" }}
            >
              Today's
            </p>
          </div>
         
          <Row className="align-items-center">
            <Col md={3}>
              <h1
                className="text-left"
                style={{
                  color: "#DB4444",
                  fontSize: "30px",
                  marginLeft: "10px",
                }}
              >
                <b>Flash Sale</b>
              </h1>
            </Col>
            <Col md={6} className="text-center">
              <div className="d-flex justify-content-center">
                {[
                  { value: days, label: "Days" },
                  { value: hours, label: "Hours" },
                  { value: minutes, label: "Minutes" },
                  { value: secs, label: "Seconds" },
                ].map((unit, index) => (
                  <div key={index} className="mx-2 text-center">
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#555",
                      }}
                    >
                      {unit.label}
                    </div>
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "#d9534f",
                      }}
                    >
                      {unit.value < 10 ? `0${unit.value}` : unit.value}
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col md={3} className="text-right">
              <button
                className="btn btn-light mx-2"
                onClick={() => scrollProducts("left")}
              >
                <ArrowBackIos />
              </button>
              <button
                className="btn btn-light mx-2"
                onClick={() => scrollProducts("right")}
              >
                <ArrowForwardIos />
              </button>
            </Col>
          </Row>
        </Container>

        <Container fluid className="py-4">
  <Row className="justify-content-center">
    <Col lg={12} md={12}>
      <div
        id="product-scroll-container"
        className="d-flex overflow-auto gap-3"
        style={{ scrollBehavior: "smooth", whiteSpace: "nowrap" }}
      >
        {loading ? (
          <div className="text-center w-100">Loading products...</div>
        ) : error ? (
          <div className="text-center w-100">{error}</div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <Grid
              item
              xs={12} sm={6} md={4} lg={3} // Adjusting to make it responsive
              key={product.id}
            >
              <div
                className="card"
                style={{
                  minWidth: "250px", // Fixed width
                  maxWidth: "300px", // Fixed width
                  minHeight: "400px", // Fixed height
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                  marginBottom: "20px", // Spacing between cards
                }}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(product.id, product)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "10px",
                    gap: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {wishlistItems.some(item => item.product_id === product.id) ? (
                    <FaHeart
                      style={{
                        fontSize: "1.5rem",
                        color: "red",
                        cursor: "pointer",
                        borderRadius: "50%",
                      }}
                      onClick={(e) => removeItem(e, product.id)}
                    />
                  ) : (
                    <FaRegHeart
                      style={{
                        fontSize: "1.5rem",
                        color: "#575B5A",
                        cursor: "pointer",
                        borderRadius: "40%",
                      }}
                      onClick={(e) => handleWishlistClick(e, product)}
                    />
                  )}
                  <FaEye
                    style={{
                      fontSize: "1.5rem",
                      color: "gray",
                      cursor: "pointer",
                      borderRadius: "40%",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(product.id, product);
                    }}
                  />
                </div>

                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: "100%", // Make image fill the container
                    height: "200px", // Increase image height
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
                {hoveredCard === product.id && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "0",
                      width: "100%",
                      backgroundColor: "black",
                      color: "white",
                      textAlign: "center",
                      padding: "8px 0",
                      cursor: "pointer",
                      opacity: 0.9,
                    }}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </div>
                )}

                <div className="card-body">
                  <h5 className="card-title" style={{ fontSize: "1.1rem" }}>
                    {product.name}
                  </h5>
                  <p className="card-text" style={{ fontSize: "0.9rem", color: "#777" }}>
                    {product.description}
                  </p>
                  <p className="card-text">
                    <strong>Price:</strong> ₹{product.price}
                  </p>
                  <div className="d-flex justify-content-start">
                    {renderStars(ratings[product.id] || 0, handleRating, product.id)}
                  </div>
                </div>
              </div>
            </Grid>
          ))
        ) : (
          <div className="text-center w-100">No products available.</div>
        )}
      </div>
    </Col>
  </Row>

  {/* Snackbar for messages */}
  <Snackbar
    open={snackbarOpen}
    autoHideDuration={3000}
    onClose={() => setSnackbarOpen(false)}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <MuiAlert
      onClose={() => setSnackbarOpen(false)}
      severity={snackbarSeverity}
      elevation={6}
      variant="filled"
      sx={{ width: "100%", textAlign: "center" }}
    >
      {snackbarMessage}
    </MuiAlert>
  </Snackbar>

  {/* View All Button */}
  <Row className="mt-4">
    <Col md={12} className="text-center">
      <button
        className="btn btn-danger"
        onClick={() => setViewAll((prev) => !prev)}
      >
        {viewAll ? "Show Less" : "View All Products"}
      </button>
    </Col>
  </Row>

  {viewAll && (
    <Row className="mt-4">
      {products.map((product) => (
        <div
          item
           xs={3} sm={6} md={4} lg={3}// Adjusting to make it responsive
          key={product.id}
        >
          <div
          
            className="card"
            style={{
              borderRadius: "10px",             
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              position: "relative",
              minWidth: "250px", // Fixed width
              maxWidth: "300px", // Fixed width
              minHeight: "400px", // Fixed height
              marginBottom: "20px", // Spacing between cards
            }}
            onMouseEnter={() => setHoveredCard(product.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(product.id, product)}
          >
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "10px",
                gap: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                            }}
            >
              {wishlistItems.some((item) => item.product_id === product.id) ? (
                <FaHeart
                  style={{
                    fontSize: "1.5rem",
                    color: "red",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                  onClick={(e) => removeItem(e, product.id)}
                />
              ) : (
                <FaRegHeart
                  style={{
                    fontSize: "1.5rem",
                    color: "#575B5A",
                    cursor: "pointer",
                    borderRadius: "40%",
                  }}
                  onClick={(e) => handleWishlistClick(e, product)}
                />
              )}
              <FaEye
                style={{
                  fontSize: "1.5rem",
                  color: "gray",
                  cursor: "pointer",
                  borderRadius: "40%",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(product.id, product);
                }}
              />
            </div>

            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: "100%", // Make image fill the container
                height: "200px", // Increase image height
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <div
              className="add-to-cart-btn"
              style={{
                position: "absolute",
                bottom: "10px",
                left: "0",
                width: "100%",
                backgroundColor: "black",
                color: "white",
                textAlign: "center",
                padding: "8px 0",
                cursor: "pointer",
                opacity: 0.9,
              }}
              onClick={(e) => handleAddToCart(e, product)}
            >
              Add to Cart
            </div>

            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: "1.1rem" }}>
                {product.name}
              </h5>
              <p className="card-text" style={{ fontSize: "0.9rem", color: "#777" }}>
                Price: ₹{product.price}
              </p>
              <div className="d-flex justify-content-start">
                {renderStars(ratings[product.id] || 0, handleRating, product.id)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </Row>
  )}
</Container>

      </Container>
      <ProductCategory />
      <br />
      <SellingProductspage />
      <Categories />
      <br />
      <ExploreOurProductspage />
      <br />
      <NewArrivalpage />
    </div>
  );
};

export default HomePage;
