import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
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

import { fetchBannersRequest } from "../features/banners/bannerActions"; // ✅ banner action

import ProductCategory from "../features/product/productCategory";
import Categorypage from "./Categorypage";
import ExploreOurProductspage from "./ExploreOurProductspage";
import NewArrivalpage from "./NewArrivalpage";
import SellingProductspage from "./SellingProductspage";
import { Carousel } from "react-bootstrap";
import StoreByCategory from "./StoreByCategory";


const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // // Product, Cart, Wishlist
  // const { products = [] } = useSelector((state) => state.products || {});
  // const { cartItems = [] } = useSelector((state) => state.cart || {});
  // const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
  // const wishlistItems = Array.isArray(wishlistData[0])
  //   ? wishlistData[0]
  //   : wishlistData;

  // Banner from Redux
  const { banners, loading: bannerLoading, error: bannerError } = useSelector(
    (state) => state.banners || {}
  );

  // Snackbar state
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // const showSnackbar = (message, severity = "success") => {
  //   setSnackbarMessage(message);
  //   setSnackbarSeverity(severity);
  //   setSnackbarOpen(true);
  // };

  useEffect(() => {
    dispatch(fetchproductsrequest());
    dispatch(fetchBannersRequest()); // ✅ Fetch banners using Redux
  }, [dispatch]);

  // const handleAddToCart = async (event, product) => {
  //   event.stopPropagation();
  //   try {
  //     const userToken = localStorage.getItem("authToken");
  //     const userData = localStorage.getItem("user");

  //     if (!userData) {
  //       showSnackbar("User not found. Please log in.", "error");
  //       return;
  //     }

  //     const user = JSON.parse(userData);

  //     const isProductInCart = cartItems.some(
  //       (item) => item.user_id === user.id && item.product_id === product.id
  //     );
  //     if (isProductInCart) {
  //       showSnackbar("Product already in cart", "warning");
  //       return;
  //     }

  //     const cartItem = {
  //       user_id: user.id,
  //       product_id: product.id,
  //       quantity: 1,
  //     };

  //     const response = await fetch(
  //       `http://${process.env.REACT_APP_IP_ADDRESS}/api/cart/add`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //         body: JSON.stringify(cartItem),
  //       }
  //     );

  //     const data = await response.json();
  //     if (!response.ok) {
  //       showSnackbar(`Error: ${data.message || response.statusText}`, "error");
  //       return;
  //     }

  //     showSnackbar("Product added to cart!", "success");
  //     dispatch(fetchApiCartDataRequest());
  //   } catch (error) {
  //     console.error("Error adding product to cart:", error);
  //     showSnackbar(`Error: ${error.message}`, "error");
  //   }
  // };

  // const handleCardClick = (productId, product) => {
  //   dispatch(setSelectedProduct(product));
  //   navigate("/productpage");
  // };

  // const handleWishlistClick = (e, product) => {
  //   e.stopPropagation();
  //   const userData = localStorage.getItem("user");
  //   if (!userData) {
  //     showSnackbar("User not found", "error");
  //     return;
  //   }

  //   const user = JSON.parse(userData);
  //   if (!user?.id || !product?.id) {
  //     showSnackbar("Invalid user or product data", "error");
  //     return;
  //   }

  //   dispatch(addToWishlistRequest(product.id));
  // };

  // const removeItem = (event, productid) => {
  //   event.stopPropagation();
  //   const wishlistItem = wishlistItems.find(
  //     (item) => Number(item.product_id) === Number(productid)
  //   );

  //   if (wishlistItem) {
  //     dispatch(removeWishlistProductRequest(wishlistItem.wishlist_id));
  //     showSnackbar("Removed from wishlist", "info");
  //   } else {
  //     showSnackbar("Product not found in wishlist", "warning");
  //   }
  // };

  return (
    <div>
      {/* Product Category Navbar */}
     
  <Row style={{ marginTop: "3%" }}>
  <Col>
    {bannerLoading ? (
      <p className="text-center">Loading banners...</p>
    ) : bannerError ? (
      <p className="text-danger text-center">{bannerError}</p>
    ) : banners.length > 0 ? (
      <Carousel
  interval={3000} // Auto-scroll every 3 seconds
  indicators={true}
  fade
  controls
  pause={false} // Optional: ensures it doesn't stop on hover
  className="rounded overflow-hidden shadow"
>
  {banners.map((banner, index) => (
    <Carousel.Item key={index}>
      <div
        style={{
          height: "320px",
          backgroundImage: `url(${banner.image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            padding: "20px 40px",
            borderRadius: "10px",
            maxWidth: "600px",
          }}
        >
          <h2 style={{ fontWeight: "bold", fontSize: "32px" }}>
            {banner.description || "Groceries delivered in 10 minutes"}
          </h2>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            {banner.offers || "Fresh produce, daily essentials & more"}
          </p>
          <Button
            variant="contained"
            sx={{
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              backgroundColor: "#ffffff",
              color: "#28a745",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Shop Now →
          </Button>
        </div>
      </div>
    </Carousel.Item>
  ))}
</Carousel>

    ) : (
      <p className="text-center">No banners available</p>
    )}
  </Col>
</Row>

       <ProductCategory />
      {/* Sections */}
      <Categorypage />
            <StoreByCategory/>

      <ExploreOurProductspage />
      <SellingProductspage />
      <NewArrivalpage />
    </div>
  );
};

export default HomePage;
