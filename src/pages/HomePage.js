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
     
      {/* Banner Section */}
      <Row style={{marginTop:"3%",}}>
        <Col>
          {bannerLoading ? (
            <p className="text-center">Loading banner...</p>
          ) : bannerError ? (
            <p className="text-danger text-center">{bannerError}</p>
          ) : banners.length > 0 ? (
            <div
              className="mx-1 "
              style={{
                backgroundImage: `url(${banners[0].image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "20px",
                height: "320px",
                width: "100%",
                maxWidth: "100%",
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
                  {banners[0].description ||
                    "Groceries delivered in 10 minutes"}
                </h2>
                <p style={{ marginBottom: "20px", fontSize: "16px" }}>
                  {banners[0].offers || "Fresh produce, daily essentials & more"}
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
            </div>
          ) : (
            <p className="text-center">No banner available</p>
          )}
        </Col>
      </Row>
       <ProductCategory />
      {/* Sections */}
      <Categorypage />
      <ExploreOurProductspage />
      <SellingProductspage />
      <NewArrivalpage />
    </div>
  );
};

export default HomePage;
