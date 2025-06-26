import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge, Col, Row } from "react-bootstrap";
import { Button } from "@mui/material";

import {
  fetchproductsrequest,
  setSelectedProduct,
} from "../features/product/productActions";
import { fetchApiCartDataRequest } from "../features/cart/cartActions";
import {
  addToWishlistRequest,
  removeWishlistProductRequest,
} from "../features/wishlist/wishlistAction";

import ProductCategory from "../features/product/productCategory";
import Categorypage from "./Categorypage";
import ExploreOurProductspage from "./ExploreOurProductspage";
import NewArrivalpage from "./NewArrivalpage";

// import image3 from "../assets/images/images22.jpg"
import SellingProductspage from "./SellingProductspage";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products = [], loading = false, error = null } =
    useSelector((state) => state.products || {});
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
  const wishlistItems = Array.isArray(wishlistData[0])
    ? wishlistData[0]
    : wishlistData;

  const [timeLeft, setTimeLeft] = useState(3600);
  const [ratings, setRatings] = useState({});
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
    if (container) {
      container.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
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
    dispatch(setSelectedProduct(product));
    navigate("/productpage");
  };

  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    const userData = localStorage.getItem("user");
    if (!userData) {
      showSnackbar("User not found", "error");
      return;
    }

    const user = JSON.parse(userData);
    if (!user?.id || !product?.id) {
      showSnackbar("Invalid user or product data", "error");
      return;
    }

    dispatch(addToWishlistRequest(product.id));
  };

  const removeItem = (event, productid) => {
    event.stopPropagation();
    const wishlistItem = wishlistItems.find(
      (item) => Number(item.product_id) === Number(productid)
    );

    if (wishlistItem) {
      dispatch(removeWishlistProductRequest(wishlistItem.wishlist_id));
      showSnackbar("Removed from wishlist", "info");
    } else {
      showSnackbar("Product not found in wishlist", "warning");
    }
  };

  return (
    <div>
       <ProductCategory />
       
      <Row className="mb-4" style={{marginTop:"7%"}} >
        <Col>
          {/* <div className="mx-2"
            style={{
            
  backgroundImage: `url(${image3})`,
  backgroundSize: "cover",            // Ensures the image covers the container
  backgroundPosition: "center",       // Centers the image
  backgroundRepeat: "no-repeat",      // Prevents tiling
  borderRadius: "20px",
  height: "320px",                    // Can be changed to a relative unit if needed
  width: "100%",                      // Makes the container take full width of its parent
  maxWidth: "100%",                   // Prevents overflow
  overflow: "hidden",
  position: "relative",
  }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "40px",
                transform: "translateY(-50%)",
                color: "white",
                maxWidth: "400px",
                padding: "20px",
              }}
            >
              <h2 style={{ fontWeight: "bold", fontSize: "32px" }}>
                Groceries delivered in <br /> 10 minutes
              </h2>
              <p style={{ marginBottom: "20px", fontSize: "16px" }}>
                Fresh produce, daily essentials & more
              </p>
              <Button
                variant="light"
                style={{
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "white",
                  color: "green",
                }}
              >
                Shop Now →
              </Button>
            </div>
          </div> */}
        </Col>
      </Row>

      {/* Other Pages */}
     
      <Categorypage />
      
      {/* <Categories /> */}
      <ExploreOurProductspage />
       <SellingProductspage />
      <NewArrivalpage />
    </div>
  );
};

export default HomePage;
